import { IClient, IHttpOptions } from '../interfaces/index';
import { createBunyanLogger } from '../loaders/logger';
import { SagaDefinitionBuilder } from '../saga/saga-definition-builder';
import { EVENTS } from '../utility/constants';
import { eventEmitter } from '../utility/event-emitter';
import { authApi } from '../utility/external-api';
import { GET_HTTP_OPTIONS } from '../utility/get-http-options';
import { https } from '../utility/request';
import { safePromise } from '../utility/safe-promise';
import ClientService from '../services/client';
import { SagaProcessor } from '../saga/saga-processor';

const log = createBunyanLogger('ClientOrchestrator');

export default class ClientOrchestratorService {
  sagaProcessor: SagaProcessor;

  public async run(): Promise<void> {
    const options: IHttpOptions = GET_HTTP_OPTIONS();
    options.hostname = authApi.host;
    options.path = `${authApi.path}/user`;
    options.method = 'PUT';
    options.port = authApi.port;
    let oldUser, oldClient;
    const sagaDefinitionBuilder = new SagaDefinitionBuilder()
      .step('UpdateUser')
      .onReply(async (_data: IClient & { authorization: string }) => {
        // Get the old object from the client and revert the user object
        // or get users object in previous request and save it in memory.
        const getUserOptions = { ...options };
        getUserOptions.method = 'GET';
        getUserOptions.path = `${getUserOptions.path}?_id=${_data._id}`;
        getUserOptions.headers.authorization = _data.authorization;
        options.headers.authorization = _data.authorization;
        let errUser;
        [errUser, oldUser] = await safePromise(https(getUserOptions, null, true, true));
        if (errUser || !oldUser.success) {
          throw errUser;
        }
        // Invoke create user event.
        const [error, result] = await safePromise(https(options, _data, true, true));
        if (error || !result?.success) {
          throw error;
        }
      })
      .withCompensation(async () => {
        // Invoke rollback create user event.
        const [error, result] = await safePromise(https(options, oldUser?.data, true, true));
        if (error || !result?.success) {
          log.error('Something went wrong while reverting update user in auth microservice')
        }
        eventEmitter.emit(EVENTS.CLIENT_UPDATE_ORCHESTRATOR, { success: false });
      })
      .step('UpdateClient')
      .onReply(async (_data: IClient) => {
        // Get the existing client object to revert in case of failure.
        const clientService = new ClientService();
        oldClient = await clientService.get({ _id: _data._id });
        await clientService.update(_data as IClient);
        eventEmitter.emit(EVENTS.CLIENT_UPDATE_ORCHESTRATOR, { success: true });
      })
      .withCompensation(async () => {
        const clientService = new ClientService();
        await clientService.update(oldClient as IClient);
      });

    this.sagaProcessor = await sagaDefinitionBuilder.build();
  }

  public getProcessor() {
    return this.sagaProcessor;
  }
}
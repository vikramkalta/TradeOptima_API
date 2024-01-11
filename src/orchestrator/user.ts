import { IHttpOptions } from '../interfaces/http-options';
import { createBunyanLogger } from '../loaders/logger';
import { SagaDefinitionBuilder } from '../saga/saga-definition-builder';
import { EVENTS } from '../utility/constants';
import { eventEmitter } from '../utility/event-emitter';
import { authApi } from '../utility/external-api';
import { GET_HTTP_OPTIONS } from '../utility/get-http-options';
import { https } from '../utility/request';
import { safePromise } from '../utility/safe-promise';
import ClientService from '../services/client';
import CompetitorService from '../services/competitor';
import InvestorService from '../services/investor';
import { SagaProcessor } from '../saga/saga-processor';

const log = createBunyanLogger('UserOrchestrator');

const clientService = new ClientService();
const investorService = new InvestorService();
const competitorService = new CompetitorService();
const createUserType = [];
createUserType.push(clientService.create);
createUserType.push(investorService.create);
createUserType.push(competitorService.create);
const deleteUserType = [];
deleteUserType.push(clientService.delete);
deleteUserType.push(investorService.delete);
deleteUserType.push(competitorService.delete);

let user;

export default class UserOrchestratorService {
  sagaProcessor: SagaProcessor;

  public async run(): Promise<void> {
    const options: IHttpOptions = GET_HTTP_OPTIONS();
    options.hostname = authApi.host;
    options.path = `${authApi.path}/user`;
    options.method = 'POST';
    options.port = authApi.port;

    const sagaDefinitionBuilder = new SagaDefinitionBuilder()
      .step('CreateUser')
      .onReply(async (_data) => {
        let error;
        [error, user] = await safePromise(https(options, _data, false, true));
        if (error || !user.success) {
          eventEmitter.emit(EVENTS.USER_CREATE_ORCHESTRATOR, error || user);
          throw error || user;
        }
      })
      .withCompensation(async () => {
        const deleteUserOptions = { ...options };
        deleteUserOptions.method = 'DELETE';
        deleteUserOptions.path = `${deleteUserOptions.path}?_id=${user._id}`;
        const [error] = await safePromise(https(deleteUserOptions, null, true, true));
        if (error) {
          log.error('Something went wrong while reverting create user in auth microservice');
        }
        eventEmitter.emit(EVENTS.USER_CREATE_ORCHESTRATOR, { success: false });
      })
      .step('CreateUserTypes')
      .onReply(async (_data) => {
        const promises = [];
        for (const create of createUserType) {
          promises.push(create({ _id: user.data?._id }));
        }
        await Promise.all(promises);
        eventEmitter.emit(EVENTS.USER_CREATE_ORCHESTRATOR, { success: true, data: user });
      })
      .withCompensation(async () => {
        const promises = [];
        for (const _delete of deleteUserType) {
          promises.push(_delete({ _id: user.data?._id }));
        }
        await Promise.all(promises);
       });

    this.sagaProcessor = await sagaDefinitionBuilder.build();
  }

  public getProcessor() {
    return this.sagaProcessor;
  }
}

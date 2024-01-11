import { IHttpOptions } from '../interfaces/http-options';
import { IInvestor } from '../interfaces/index';
import { createBunyanLogger } from '../loaders/logger';
import { SagaDefinitionBuilder } from '../saga/saga-definition-builder';
import { EVENTS } from '../utility/constants';
import { eventEmitter } from '../utility/event-emitter';
import { authApi } from '../utility/external-api';
import { GET_HTTP_OPTIONS } from '../utility/get-http-options';
import { https } from '../utility/request';
import { safePromise } from '../utility/safe-promise';
import InvestorService from '../services/investor';
import { SagaProcessor } from '../saga/saga-processor';

const log = createBunyanLogger('InvestorOrchestrator');

export default class InvestorOrchestratorService {
  sagaProcessor: SagaProcessor;

  public async run(): Promise<void> {
    const options: IHttpOptions = GET_HTTP_OPTIONS();
    // options.headers.authorization = data.authorization;
    options.hostname = authApi.host;
    options.path = `${authApi.path}/user`;
    options.method = 'PUT';
    options.port = authApi.port;
    let oldUser, oldInvestor;
    const sagaDefinitionBuilder = new SagaDefinitionBuilder()
      .step('UpdateUser')
      .onReply(async (_data: IInvestor & { authorization: string }) => {
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
        eventEmitter.emit(EVENTS.INVESTOR_UPDATE_ORCHESTRATOR, { success: false });
      })
      .step('UpdateInvestor')
      .onReply(async (_data: IInvestor) => {
        // Get the existing investor object to revert in case of failure.
        const investorService = new InvestorService();
        oldInvestor = await investorService.get({ _id: _data._id });
        await investorService.update(_data as IInvestor);
        eventEmitter.emit(EVENTS.INVESTOR_UPDATE_ORCHESTRATOR, { success: true });
      })
      .withCompensation(async () => {
        const investorService = new InvestorService();
        await investorService.update(oldInvestor as IInvestor);
      });

    this.sagaProcessor = await sagaDefinitionBuilder.build();
  }

  public getProcessor() {
    return this.sagaProcessor;
  }
}
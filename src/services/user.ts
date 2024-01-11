import UserOrchestratorService from '../orchestrator/user';
import { EVENTS } from '../utility/constants';
import { eventEmitter } from '../utility/event-emitter';

export default class UserService {
  userOrchestratorService: UserOrchestratorService;

  constructor() {
    this.userOrchestratorService = new UserOrchestratorService();
    this.userOrchestratorService.run();
  }

  public registerUser(data): Promise<{success: true}> {
    const sagaProcessor = this.userOrchestratorService.getProcessor();
    sagaProcessor.start(data);
    return new Promise((resolve, reject) => {
      eventEmitter.on(EVENTS.USER_CREATE_ORCHESTRATOR, event => {
        if (event.success) {
          return resolve(event.data);
        } else {
          return reject(event?.data || event);
        }
      });
    });
  }
}
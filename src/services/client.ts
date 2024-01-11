import { Client } from '../models';
import { IClient, IService } from '../interfaces';
import ClientOrchestratorService from '../orchestrator/client';
import { eventEmitter } from '../utility/event-emitter';
import { EVENTS } from '../utility/constants';

export default class ClientService implements IService {
  clientOrchestratorService: ClientOrchestratorService;

  constructor() {
    this.clientOrchestratorService = new ClientOrchestratorService();
    this.clientOrchestratorService.run();
  }

  public async create(data: IClient): Promise<IClient> {
    let client: IClient;
    if (data._id) {
      client = await Client.model.findOne({ _id: data._id });
      if (!client) {
        client = await Client.model.create(data);
      }
    } else {
      client = await Client.model.create(data);
    }
    return client;
  }

  public updateClient(data: IClient) {
    const sagaProcessor = this.clientOrchestratorService.getProcessor();
    sagaProcessor.start(data);
    return new Promise((resolve, reject) => {
      eventEmitter.on(EVENTS.CLIENT_UPDATE_ORCHESTRATOR, event => {
        if (event.success) {
          return resolve(event.data);
        } else {
          return reject(event?.data || event);
        }
      });
    });
  }

  public async update(data: IClient): Promise<IClient> {
    const client: IClient = await Client.model.findOneAndUpdate({ _id: data._id, 'auditInfo.active': true }, data).lean();
    return client;
  }

  public async delete(data: IClient): Promise<boolean> {
    await Client.model.deleteOne(data);
    return true;
  }

  public async get(filter: { _id: string }): Promise<IClient> {
    const client = await Client.model.findOne({ _id: filter._id, 'auditInfo.active': true }).lean();
    return client;
  }
}
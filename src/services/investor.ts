import { Investor } from '../models';
import { IInvestor, IService } from '../interfaces';
import InvestorOrchestratorService from '../orchestrator/investor';
import { eventEmitter } from '../utility/event-emitter';
import { EVENTS } from '../utility/constants';

export default class InvestorService implements IService {
  investorOrchestratorService: InvestorOrchestratorService;

  constructor() {
    this.investorOrchestratorService = new InvestorOrchestratorService();
    this.investorOrchestratorService.run();
  }

  public async create(data: IInvestor): Promise<IInvestor> {
    let investor: IInvestor;
    if (data._id) {
      investor = await Investor.model.findOne({ _id: data._id });
      if (!investor) {
        investor = await Investor.model.create(data);
      }
    } else {
      investor = await Investor.model.create(data);
    }
    return investor;
  }

  public async update(data: IInvestor): Promise<IInvestor> {
    const investor: IInvestor = await Investor.model.findOneAndUpdate({ _id: data._id, 'auditInfo.active': true }, data).lean();
    return investor;
  }

  public updateInvestor(data: IInvestor) {
    const sagaProcessor = this.investorOrchestratorService.getProcessor();
    sagaProcessor.start(data);
    return new Promise((resolve, reject) => {
      eventEmitter.on(EVENTS.INVESTOR_UPDATE_ORCHESTRATOR, event => {
        if (event.success) {
          return resolve(event.data);
        } else {
          return reject(event?.data || event);
        }
      });
    });
  }

  public async delete(data: IInvestor): Promise<boolean> {
    await Investor.model.deleteOne(data);
    return true;
  }

  public async get(filter: { _id: string }): Promise<IInvestor> {
    const investor = await Investor.model.findOne({ _id: filter._id, 'auditInfo.active': true });
    return investor;
  }
}
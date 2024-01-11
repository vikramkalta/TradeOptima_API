import { ICompetitor } from '../interfaces/competitor';
import { IService } from '../interfaces/service';
import { Competitor } from '../models';
import CompetitorOrchestratorService from '../orchestrator/competitor';
import { EVENTS } from '../utility/constants';
import { eventEmitter } from '../utility/event-emitter';

export default class CompetitorService implements IService {
  competitorOrchestratorService: CompetitorOrchestratorService;

  constructor() {
    this.competitorOrchestratorService = new CompetitorOrchestratorService();
    this.competitorOrchestratorService.run();
  }

  public async create(data: ICompetitor): Promise<ICompetitor> {
    let competitor: ICompetitor;
    if (data._id) {
      competitor = await Competitor.model.findOne({ _id: data._id });
      if (!competitor) {
        competitor = await Competitor.model.create(data);
      }
    } else {
      competitor = await Competitor.model.create(data);
    }
    return competitor;
  }

  public async update(data: ICompetitor): Promise<ICompetitor> {
    const competitor: ICompetitor = await Competitor.model.findOneAndUpdate({ _id: data._id, 'auditInfo.active': true}, data).lean();
    return competitor;
  }

  public updateCompetitor(data: ICompetitor) {
    const sagaProcessor = this.competitorOrchestratorService.getProcessor();
    sagaProcessor.start(data);
    return new Promise((resolve, reject) => {
      eventEmitter.on(EVENTS.COMPETITOR_UPDATE_ORCHESTRATOR, event => {
        if (event.success) {
          return resolve(event.data);
        } else {
          return reject(event?.data || event);
        }
      });
    });
  }

  public async delete(data: ICompetitor): Promise<boolean> {
    await Competitor.model.deleteOne(data);
    return true;
  }

  public async get(filter: {_id: string}): Promise<ICompetitor> {
    const competitor = await Competitor.model.findOne({_id: filter._id, 'auditInfo.active': true}).lean();
    return competitor;
  }
}
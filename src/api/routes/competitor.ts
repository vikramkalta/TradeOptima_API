import { celebrate, Joi } from 'celebrate';
import { Router, Request, Response, NextFunction } from 'express';

import { createBunyanLogger } from '../../loaders/logger';
import CompetitorService from '../../services/competitor';
import CompetitorOrchestratorService from '../../orchestrator/competitor';
import middlewares from '../middlewares/index';

const route = Router();
const log = createBunyanLogger('Competitor routes');

export default (app: Router): void => {
  app.use('/competitor', route);

  route.post('/', middlewares.logger, middlewares.auth, celebrate({
    body: Joi.object({
      _id: Joi.string().required(),
    }).options({ allowUnknown:true })
  }), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const competitorService = new CompetitorService();
      const result = await competitorService.create(req.body);
      return res.send(result);
    } catch (error) {
      log.error('Error in create competitor route', error);
      return next(error);
    }
  });

  route.put('/', middlewares.logger, middlewares.auth, celebrate({
    body: Joi.object().options({allowUnknown: true})
  }), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const competitorService = new CompetitorService();
      req.body.authorization = req.headers.authorization;
      const result = await competitorService.updateCompetitor(req.body);
      return res.send(result);
    } catch (error) {
      log.error('Error in update competitor route', error);
      return next(error);
    }
  });

  route.get('/', middlewares.logger, middlewares.auth, celebrate({
    query: Joi.object({ _id: Joi.string().required() }).options({ allowUnknown: true })
  }), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const competitorService = new CompetitorService();
      const result = await competitorService.get(req.query as { _id: string });
      return res.send(result);
    } catch (error) {
      log.error('Error in get competitor route', error);
      return next(error);
    }
  });
};
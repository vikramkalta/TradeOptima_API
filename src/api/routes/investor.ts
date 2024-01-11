import { Router, Request, Response, NextFunction } from 'express';
import { celebrate, Joi } from 'celebrate';

import { createBunyanLogger } from '../../loaders/logger';
import middlewares from '../middlewares/index';
import InvestorService from '../../services/investor';
import InvestorOrchestratorService from '../../orchestrator/investor';

const route = Router();
const log = createBunyanLogger('Investor routes');

export default (app: Router): void => {
  app.use('/investor', route);

  route.post('/', middlewares.logger, middlewares.auth, celebrate({
    body: Joi.object({
      _id: Joi.string().required(),
      investorType: Joi.string().required(),
    }).options({ allowUnknown: true })
  }), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const investorService = new InvestorService();
      const result = await investorService.create(req.body);
      return res.send(result);
    } catch (error) {
      log.error('Error in create investor route', error);
      return next(error);
    }
  });

  route.put('/', middlewares.logger, middlewares.auth, celebrate({
    body: Joi.object({ _id: Joi.string().required() }).options({ allowUnknown: true })
  }), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const investorService = new InvestorService();
      req.body.authorization = req.headers.authorization;
      const result = await investorService.updateInvestor(req.body);
      return res.send(result);
    } catch (error) {
      log.error('Error in update investor route', error);
      return next(error);
    }
  });

  route.get('/', middlewares.logger, middlewares.auth, celebrate({
    query: Joi.object({ _id: Joi.string().required() }).options({ allowUnknown: true })
  }), async (req: Request, res: Response, next: NextFunction) => {
      try {
        const investorService = new InvestorService();
        const result = await investorService.get(req.query as { _id: string });
        return res.send(result);
      } catch (error) {
        log.error('Error in get investor route', error);
        return next(error);
      }
    });
}
import { celebrate, Joi } from 'celebrate';
import { NextFunction, Request, Response, Router } from 'express';

import { createBunyanLogger } from '../../loaders/logger';
import UserService from '../../services/user';
import middlewares from '../middlewares/index';

const route = Router();
const log = createBunyanLogger('User routes');

// Initialise service
const userService = new UserService();

export default (app: Router): void => {
  app.use('/user', route);

  route.post('/register', middlewares.logger, celebrate({
    body: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      username: Joi.string().required(),
      email: Joi.string().required(),
      dob: Joi.date().required(),
      password: Joi.string().required(),
    }).options({ allowUnknown: true }),
  }), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await userService.registerUser(req.body);
      return res.send(result);
    } catch (error) {
      log.error('Error in create user route', error);
      return next(error);
    }
  });
} 
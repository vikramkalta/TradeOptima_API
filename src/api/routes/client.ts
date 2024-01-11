import { Router, Request, Response, NextFunction } from 'express';
import { celebrate, Joi } from 'celebrate';

import { createBunyanLogger } from '../../loaders/logger';
import middlewares from '../middlewares/index';
import ClientService from '../../services/client';
import ClientOrchestratorService from '../../orchestrator/client';

const route = Router();
const log = createBunyanLogger('User routes');

export default (app: Router): void => {
  app.use('/client', route);

  /**
    * @api {post} /client Create client.
    * @apiName CreateClient
    * @apiGroup Client
    * 
    * @apiBody {String} _id Id of the user.
    * @apiBody {Object[]} [exchangeDetails]       Optional List of exchange information.
    * @apiBody {String} [exchangeDetails[exchangeId]] Optional Exchange id.
    * @apiBody {String} [exchangeDetails[apiKey]]    Optional API key of exchange.
    * @apiBody {String} [exchangeDetails[secretKey]]    Optional Secret key of exchange.
    * @apiBody {String} [clientType]       Type of client such as personal or business.
    * @apiBody {String} [taxId]       Optional Tax id.
    * @apiBody {Object[]} [addresses]       Optional Address object.
    * @apiBody {String} [addresses[address1]] Optional Address line 1.
    * @apiBody {String} [addresses[address2]]    Optional Address line 2.
    * @apiBody {String} [addresses[city]]   Optional City.
    * @apiBody {String} [addresses[postcode]]   Optional Postcode.
    * 
    * @apiSuccess {Boolean} success Determines the status of an API.
    * @apiSuccess {Object} data Data object holding main response data.
    * @apiSuccess {Boolean} data.success Determines whether username exists or not.
    *
    * @apiSuccessExample {json} Success Response:
    *     HTTP/1.1 200 OK
    *     {
    *         "success": true,
    *         "data": {
    *             "success": true
    *         }
    *     }
   */
  route.post('/', middlewares.logger, middlewares.auth, celebrate({
    body: Joi.object({
      _id: Joi.string().required(),
      clientType: Joi.string().required(),
    }).options({ allowUnknown: true })
  }), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clientService = new ClientService();
      const result = await clientService.create(req.body);
      return res.send(result);
    } catch (error) {
      log.error('Error in create client route', error);
      return next(error);
    }
  });

  /**
    * @api {put} /client Update client.
    * @apiName UpdateClient
    * @apiGroup Client
    * 
    * @apiBody {String} _id        Id of the user.
    * @apiBody {String} [firstName]   Optional Firstname of the user.
    * @apiBody {String} [lastname]   Optional Lastname.
    * @apiBody {String} [username]   Optional Unique username of the user.
    * @apiBody {String} [email]   Optional Email of the user.
    * @apiBody {Date} [dob]   Optional Date of birth object.
    * @apiBody {Object[]} [exchangeDetails]       Optional List of exchange information.
    * @apiBody {String} [exchangeDetails[exchangeId]] Optional Exchange id.
    * @apiBody {String} [exchangeDetails[apiKey]]    Optional API key of exchange.
    * @apiBody {String} [exchangeDetails[secretKey]]    Optional Secret key of exchange.
    * @apiBody {String} [clientType]       Optional Type of client such as personal or business.
    * @apiBody {String} [taxId]       Optional Tax id.
    * @apiBody {Object[]} [addresses]       Optional Address object.
    * @apiBody {String} [addresses[address1]] Optional Address line 1.
    * @apiBody {String} [addresses[address2]]    Optional Address line 2.
    * @apiBody {String} [addresses[city]]   Optional City.
    * @apiBody {String} [addresses[postcode]]   Optional Postcode.
    * 
    * @apiSuccess {Boolean} success Determines the status of an API.
    * @apiSuccess {Object} data Data object holding main response data.
    * @apiSuccess {Boolean} data.success Determines whether user updated or not.
    *
    * @apiSuccessExample {json} Success Response:
    *     HTTP/1.1 200 OK
    *     {
    *         "success": true,
    *         "data": {
    *             "success": true
    *         }
    *     }
   */
  route.put('/', middlewares.logger, middlewares.auth, celebrate({
    body: Joi.object({ _id: Joi.string().required() }).options({ allowUnknown: true }),
  }), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clientService = new ClientService();
      req.body.authorization = req.headers.authorization;
      const result = await clientService.updateClient(req.body);
      return res.send(result);
    } catch (error) {
      log.error('Error in update client route', error);
      return next(error);
    }
  });

  /**
    * @api {get} /client Get client.
    * @apiName GetClient
    * @apiGroup Client
    * 
    * @apiQuery {String} _id        Id of the user.
    * 
    * @apiSuccess {Boolean} success Determines the status of an API.
    * @apiSuccess {Object} data Data object holding main response data.
    * @apiSuccess {Object[]} exchangeDetails       List of exchange information.
    * @apiSuccess {String} exchangeDetails[exchangeId] Exchange id.
    * @apiSuccess {String} exchangeDetails[apiKey]    API key of exchange.
    * @apiSuccess {String} exchangeDetails[secretKey]    Secret key of exchange.
    * @apiSuccess {String} clientType       Type of client such as personal or business.
    * @apiSuccess {String} taxId       Tax id.
    * @apiSuccess {Object[]} addresses       Address object.
    * @apiSuccess {String} addresses[address1] Address line 1.
    * @apiSuccess {String} addresses[address2]    Address line 2.
    * @apiSuccess {String} addresses[city]   City.
    * @apiSuccess {String} addresses[postcode]   Postcode.
    * @apiSuccess {String} firstName   Firstname of the user.
    * @apiSuccess {String} lastname   Lastname.
    * @apiSuccess {String} username   Unique username of the user.
    * @apiSuccess {String} email   Email of the user.
    * @apiSuccess {Date} dob   Date of birth object.
    *
    * @apiSuccessExample {json} Success Response:
    *     HTTP/1.1 200 OK
    *     {
    *         "success": true,
    *         "data": {
    *             "firstName": "Test",
    *             "lastname": "Test",
    *             "username": "test123",
    *             "email": "test@test.com",
    *             "dob": "7-8-1998",
    *             "exchangeDetails": [{
    *                 "exchangeId": "e123",
    *                 "apiKey": "ak123",
    *                 "secretKey": "sk123",
    *             }],
    *             "clientType": "Personal",
    *             "taxId": "ti123",
    *             "addresses": [{
    *                 "address1": "1A",
    *                 "address2": "17/18 coppergate",
    *                 "city": "sa15jz",
    *             }],
    *         }
    *     }
   */
  route.get('/', middlewares.logger, middlewares.auth, celebrate({
    query: Joi.object({ _id: Joi.string().required() }).options({ allowUnknown: true })
  }), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clientService = new ClientService();
      const result = await clientService.get(req.query as { _id: string });
      return res.send(result);
    } catch (error) {
      log.error('Error in get client route', error);
      return next(error);
    }
  });
};
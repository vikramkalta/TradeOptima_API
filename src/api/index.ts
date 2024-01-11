import { IRouter, Router } from 'express';
import client from './routes/client';
import competitor from './routes/competitor';
import investor from './routes/investor';
import user from './routes/user';

// guaranteed to get dependencies
export default (): IRouter => {
  const app = Router();
  client(app);
  competitor(app);
  investor(app);
  user(app);
  return app;
}
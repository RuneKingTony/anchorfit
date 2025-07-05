import { VercelRequest, VercelResponse } from '@vercel/node';
import express, { Request, Response } from 'express';
import { registerRoutes } from '../server/routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

registerRoutes(app);

export default (req: VercelRequest, res: VercelResponse) => {
  app(req as any, res as any);
};

import { FastifyInstance } from 'fastify';
import { CafeController } from '../controllers/cafeController';
import { Pool } from 'pg';

export const setCafeRoutes = (app: FastifyInstance, db: Pool) => {
    const cafeController = new CafeController(db);

    app.get('/api/cafe/menu', cafeController.getMenuItems.bind(cafeController));
    app.post('/api/cafe/order', cafeController.processOrder.bind(cafeController));
};
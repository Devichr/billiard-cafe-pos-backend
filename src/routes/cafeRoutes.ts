import { FastifyInstance } from 'fastify';
import { CafeController } from '../controllers/cafeController';

export const setCafeRoutes = (app: FastifyInstance) => {
    const cafeController = new CafeController();

    app.get('/api/cafe/menu', cafeController.getMenuItems.bind(cafeController));
    app.post('/api/cafe/order', cafeController.processOrder.bind(cafeController));
};
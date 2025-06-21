import { FastifyInstance } from 'fastify';
import { BilliardController } from '../controllers/billiardController';

export const setBilliardRoutes = (app: FastifyInstance) => {
    const billiardController = new BilliardController();

    app.post('/api/billiard/reservations', billiardController.createReservation.bind(billiardController));
    app.get('/api/billiard/reservations', billiardController.getReservations.bind(billiardController));
    app.patch('/api/billiard/reservations/status', billiardController.updateReservationStatus.bind(billiardController));
};
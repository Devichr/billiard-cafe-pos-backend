import { FastifyInstance } from 'fastify';
import { BilliardController } from '../controllers/billiardController';

import { Pool } from 'pg';

export const setBilliardRoutes = (app: FastifyInstance, db: Pool) => {
    const billiardController = new BilliardController(db);

    app.post('/api/billiard/reservations', billiardController.createReservation.bind(billiardController));
    app.get('/api/billiard/reservations', billiardController.getReservations.bind(billiardController));
    app.patch('/api/billiard/reservations/status', billiardController.updateReservationStatus.bind(billiardController));
};
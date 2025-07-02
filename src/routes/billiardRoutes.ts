import { FastifyInstance } from 'fastify';
import { BilliardController } from '../controllers/billiardController';
import { Pool } from 'pg';

export const setBilliardRoutes = async (app: FastifyInstance, options: { db: Pool }) => {
    const { db } = options;
    const billiardController = new BilliardController(db);

    // Create a new reservation
    app.post('/api/billiard/reservations', billiardController.createReservation.bind(billiardController));
    
    // Get all reservations
    app.get('/api/billiard/reservations', billiardController.getReservations.bind(billiardController));
    
    // Get a specific reservation by ID
    app.get('/api/billiard/reservations/:id', billiardController.getReservationById.bind(billiardController));
    
    // Update reservation status
    app.patch('/api/billiard/reservations/status', billiardController.updateReservationStatus.bind(billiardController));
    
    // Update a reservation
    app.put('/api/billiard/reservations/:id', billiardController.updateReservation.bind(billiardController));
    
    // Delete a reservation
    app.delete('/api/billiard/reservations/:id', billiardController.deleteReservation.bind(billiardController));
    
    // Get table status
    app.get('/api/billiard/tables/status', billiardController.getTableStatus.bind(billiardController));
};


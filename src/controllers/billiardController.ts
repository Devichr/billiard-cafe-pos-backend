import { FastifyReply, FastifyRequest } from 'fastify';
import { BilliardService } from '../services/billiardService';
import { Pool } from 'pg';

export class BilliardController {
    private billiardService: BilliardService;

    constructor(db: Pool) {
        this.billiardService = new BilliardService(db);
    }

    async createReservation(request: FastifyRequest, reply: FastifyReply) {
        try {
            const reservationData = request.body as any;
            const reservation = await this.billiardService.createReservation(reservationData);
            reply.status(201).send({ success: true, data: reservation });
        } catch (error) {
            console.error('Error creating reservation:', error);
            reply.status(500).send({ success: false, message: 'Failed to create reservation' });
        }
    }

    async getReservations(request: FastifyRequest, reply: FastifyReply) {
        try {
            const reservations = await this.billiardService.getReservations();
            reply.send({ success: true, data: reservations });
        } catch (error) {
            console.error('Error fetching reservations:', error);
            reply.status(500).send({ success: false, message: 'Failed to fetch reservations' });
        }
    }

    async getReservationById(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const reservation = await this.billiardService.getReservationById(parseInt(id));
            
            if (!reservation) {
                reply.status(404).send({ success: false, message: 'Reservation not found' });
                return;
            }
            
            reply.send({ success: true, data: reservation });
        } catch (error) {
            console.error('Error fetching reservation:', error);
            reply.status(500).send({ success: false, message: 'Failed to fetch reservation' });
        }
    }

    async updateReservationStatus(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id, status } = request.body as { id: number; status: string };
            const updated = await this.billiardService.updateReservationStatus(id, status);
            
            if (!updated) {
                reply.status(404).send({ success: false, message: 'Reservation not found' });
                return;
            }
            
            reply.send({ success: true, data: updated });
        } catch (error) {
            console.error('Error updating reservation status:', error);
            reply.status(500).send({ success: false, message: 'Failed to update reservation status' });
        }
    }

    async updateReservation(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const updateData = request.body as any;
            const updated = await this.billiardService.updateReservation(parseInt(id), updateData);
            
            if (!updated) {
                reply.status(404).send({ success: false, message: 'Reservation not found' });
                return;
            }
            
            reply.send({ success: true, data: updated });
        } catch (error) {
            console.error('Error updating reservation:', error);
            reply.status(500).send({ success: false, message: 'Failed to update reservation' });
        }
    }

    async deleteReservation(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const deleted = await this.billiardService.deleteReservation(parseInt(id));
            
            if (!deleted) {
                reply.status(404).send({ success: false, message: 'Reservation not found' });
                return;
            }
            
            reply.send({ success: true, message: 'Reservation deleted successfully' });
        } catch (error) {
            console.error('Error deleting reservation:', error);
            reply.status(500).send({ success: false, message: 'Failed to delete reservation' });
        }
    }

    async getTableStatus(request: FastifyRequest, reply: FastifyReply) {
        try {
            const tableStatus = await this.billiardService.getTableStatus();
            reply.send({ success: true, data: tableStatus });
        } catch (error) {
            console.error('Error fetching table status:', error);
            reply.status(500).send({ success: false, message: 'Failed to fetch table status' });
        }
    }
}


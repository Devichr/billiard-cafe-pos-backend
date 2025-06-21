import { FastifyReply, FastifyRequest } from 'fastify';
import { BilliardService } from '../services/billiardService';
import { Pool } from 'pg';


export class BilliardController {
    private billiardService: BilliardService;

    constructor(db : Pool) {
        this.billiardService = new BilliardService(db);
    }

    async createReservation(request: FastifyRequest, reply: FastifyReply) {
        try {
            const reservation = await this.billiardService.createReservation(request.body as any);
            reply.send({ success: true, data: reservation });
        } catch (error) {
            reply.status(500).send({ success: false, message: 'Failed to create reservation' });
        }
    }

    async getReservations(request: FastifyRequest, reply: FastifyReply) {
        try {
            const reservations = await this.billiardService.getReservations();
            reply.send({ success: true, data: reservations });
        } catch (error) {
            reply.status(500).send({ success: false, message: 'Failed to fetch reservations' });
        }
    }

    async updateReservationStatus(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id, status } = request.body as any;
            const updated = await this.billiardService.updateReservationStatus(id, status);
            reply.send({ success: true, data: updated });
        } catch (error) {
            reply.status(500).send({ success: false, message: 'Failed to update reservation status' });
        }
    }
}
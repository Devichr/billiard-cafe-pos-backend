import { FastifyReply, FastifyRequest } from 'fastify';
import { Pool } from 'pg';
export declare class BilliardController {
    private billiardService;
    constructor(db: Pool);
    createReservation(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getReservations(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getReservationById(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    updateReservationStatus(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    updateReservation(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    deleteReservation(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getTableStatus(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}
//# sourceMappingURL=billiardController.d.ts.map
import { FastifyReply, FastifyRequest } from 'fastify';
import { CafeService } from '../services/cafeService';
import { Pool } from 'pg';

export class CafeController {
    private cafeService: CafeService;

    constructor(db: Pool) {
        this.cafeService = new CafeService(db);
    }

    public async getMenuItems(request: FastifyRequest, reply: FastifyReply) {
        try {
            const menuItems = await this.cafeService.getMenuItems();
            reply.send(menuItems);
        } catch (error) {
            reply.status(500).send({ error: 'Failed to retrieve menu items' });
        }
    }

    public async processOrder(request: FastifyRequest, reply: FastifyReply) {
        const { orderId } = request.body as { orderId?: unknown };
        if (typeof orderId !== 'number') {
            reply.status(400).send({ error: 'Invalid or missing orderId' });
            return;
        }
        try {
            const orderResult = await this.cafeService.processOrder(orderId);
            reply.send(orderResult);
        } catch (error) {
            reply.status(500).send({ error: 'Failed to process order' });
        }
    }
}
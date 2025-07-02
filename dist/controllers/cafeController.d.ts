import { FastifyReply, FastifyRequest } from 'fastify';
import { Pool } from 'pg';
export declare class CafeController {
    private cafeService;
    constructor(db: Pool);
    getMenuItems(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getMenuItemById(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    createMenuItem(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    updateMenuItem(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    deleteMenuItem(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getOrders(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getOrderById(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    createOrder(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    updateOrder(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    updateOrderStatus(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    deleteOrder(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getOrderItems(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    addOrderItem(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    removeOrderItem(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}
//# sourceMappingURL=cafeController.d.ts.map
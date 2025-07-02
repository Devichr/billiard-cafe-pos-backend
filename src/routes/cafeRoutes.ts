import { FastifyInstance } from 'fastify';
import { CafeController } from '../controllers/cafeController';
import { Pool } from 'pg';

export const setCafeRoutes = async (app: FastifyInstance, options: { db: Pool }) => {
    const { db } = options;
    const cafeController = new CafeController(db);

    // Menu Items CRUD
    app.get('/api/cafe/menu', cafeController.getMenuItems.bind(cafeController));
    app.post('/api/cafe/menu', cafeController.createMenuItem.bind(cafeController));
    app.get('/api/cafe/menu/:id', cafeController.getMenuItemById.bind(cafeController));
    app.put('/api/cafe/menu/:id', cafeController.updateMenuItem.bind(cafeController));
    app.delete('/api/cafe/menu/:id', cafeController.deleteMenuItem.bind(cafeController));

    // Orders CRUD
    app.get('/api/cafe/orders', cafeController.getOrders.bind(cafeController));
    app.post('/api/cafe/order', cafeController.createOrder.bind(cafeController));
    app.get('/api/cafe/orders/:id', cafeController.getOrderById.bind(cafeController));
    app.put('/api/cafe/orders/:id', cafeController.updateOrder.bind(cafeController));
    app.patch('/api/cafe/orders/:id/status', cafeController.updateOrderStatus.bind(cafeController));
    app.delete('/api/cafe/orders/:id', cafeController.deleteOrder.bind(cafeController));

    // Order Items
    app.get('/api/cafe/orders/:id/items', cafeController.getOrderItems.bind(cafeController));
    app.post('/api/cafe/orders/:id/items', cafeController.addOrderItem.bind(cafeController));
    app.delete('/api/cafe/orders/:orderId/items/:itemId', cafeController.removeOrderItem.bind(cafeController));
};


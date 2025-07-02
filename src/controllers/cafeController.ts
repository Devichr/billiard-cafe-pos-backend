import { FastifyReply, FastifyRequest } from 'fastify';
import { CafeService } from '../services/cafeService';
import { Pool } from 'pg';

export class CafeController {
    private cafeService: CafeService;

    constructor(db: Pool) {
        this.cafeService = new CafeService(db);
    }

    // Menu Items CRUD
    async getMenuItems(request: FastifyRequest, reply: FastifyReply) {
        try {
            const menuItems = await this.cafeService.getMenuItems();
            reply.send({ success: true, data: menuItems });
        } catch (error) {
            console.error('Error fetching menu items:', error);
            reply.status(500).send({ success: false, message: 'Failed to fetch menu items' });
        }
    }

    async getMenuItemById(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const menuItem = await this.cafeService.getMenuItemById(parseInt(id));
            
            if (!menuItem) {
                reply.status(404).send({ success: false, message: 'Menu item not found' });
                return;
            }
            
            reply.send({ success: true, data: menuItem });
        } catch (error) {
            console.error('Error fetching menu item:', error);
            reply.status(500).send({ success: false, message: 'Failed to fetch menu item' });
        }
    }

    async createMenuItem(request: FastifyRequest, reply: FastifyReply) {
        try {
            const menuItemData = request.body as any;
            const menuItem = await this.cafeService.createMenuItem(menuItemData);
            reply.status(201).send({ success: true, data: menuItem });
        } catch (error) {
            console.error('Error creating menu item:', error);
            reply.status(500).send({ success: false, message: 'Failed to create menu item' });
        }
    }

    async updateMenuItem(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const updateData = request.body as any;
            const updated = await this.cafeService.updateMenuItem(parseInt(id), updateData);
            
            if (!updated) {
                reply.status(404).send({ success: false, message: 'Menu item not found' });
                return;
            }
            
            reply.send({ success: true, data: updated });
        } catch (error) {
            console.error('Error updating menu item:', error);
            reply.status(500).send({ success: false, message: 'Failed to update menu item' });
        }
    }

    async deleteMenuItem(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const deleted = await this.cafeService.deleteMenuItem(parseInt(id));
            
            if (!deleted) {
                reply.status(404).send({ success: false, message: 'Menu item not found' });
                return;
            }
            
            reply.send({ success: true, message: 'Menu item deleted successfully' });
        } catch (error) {
            console.error('Error deleting menu item:', error);
            reply.status(500).send({ success: false, message: 'Failed to delete menu item' });
        }
    }

    // Orders CRUD
    async getOrders(request: FastifyRequest, reply: FastifyReply) {
        try {
            const orders = await this.cafeService.getOrders();
            reply.send({ success: true, data: orders });
        } catch (error) {
            console.error('Error fetching orders:', error);
            reply.status(500).send({ success: false, message: 'Failed to fetch orders' });
        }
    }

    async getOrderById(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const order = await this.cafeService.getOrderById(parseInt(id));
            
            if (!order) {
                reply.status(404).send({ success: false, message: 'Order not found' });
                return;
            }
            
            reply.send({ success: true, data: order });
        } catch (error) {
            console.error('Error fetching order:', error);
            reply.status(500).send({ success: false, message: 'Failed to fetch order' });
        }
    }

    async createOrder(request: FastifyRequest, reply: FastifyReply) {
        try {
            const orderData = request.body as any;
            const order = await this.cafeService.createOrder(orderData);
            reply.status(201).send({ success: true, data: order });
        } catch (error) {
            console.error('Error creating order:', error);
            reply.status(500).send({ success: false, message: 'Failed to create order' });
        }
    }

    async updateOrder(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const updateData = request.body as any;
            const updated = await this.cafeService.updateOrder(parseInt(id), updateData);
            
            if (!updated) {
                reply.status(404).send({ success: false, message: 'Order not found' });
                return;
            }
            
            reply.send({ success: true, data: updated });
        } catch (error) {
            console.error('Error updating order:', error);
            reply.status(500).send({ success: false, message: 'Failed to update order' });
        }
    }

    async updateOrderStatus(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const { status } = request.body as { status: string };
            const updated = await this.cafeService.updateOrderStatus(parseInt(id), status);
            
            if (!updated) {
                reply.status(404).send({ success: false, message: 'Order not found' });
                return;
            }
            
            reply.send({ success: true, data: updated });
        } catch (error) {
            console.error('Error updating order status:', error);
            reply.status(500).send({ success: false, message: 'Failed to update order status' });
        }
    }

    async deleteOrder(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const deleted = await this.cafeService.deleteOrder(parseInt(id));
            
            if (!deleted) {
                reply.status(404).send({ success: false, message: 'Order not found' });
                return;
            }
            
            reply.send({ success: true, message: 'Order deleted successfully' });
        } catch (error) {
            console.error('Error deleting order:', error);
            reply.status(500).send({ success: false, message: 'Failed to delete order' });
        }
    }

    // Order Items
    async getOrderItems(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const items = await this.cafeService.getOrderItems(parseInt(id));
            reply.send({ success: true, data: items });
        } catch (error) {
            console.error('Error fetching order items:', error);
            reply.status(500).send({ success: false, message: 'Failed to fetch order items' });
        }
    }

    async addOrderItem(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const itemData = request.body as any;
            const item = await this.cafeService.addOrderItem(parseInt(id), itemData);
            reply.status(201).send({ success: true, data: item });
        } catch (error) {
            console.error('Error adding order item:', error);
            reply.status(500).send({ success: false, message: 'Failed to add order item' });
        }
    }

    async removeOrderItem(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { orderId, itemId } = request.params as { orderId: string; itemId: string };
            const removed = await this.cafeService.removeOrderItem(parseInt(orderId), parseInt(itemId));
            
            if (!removed) {
                reply.status(404).send({ success: false, message: 'Order item not found' });
                return;
            }
            
            reply.send({ success: true, message: 'Order item removed successfully' });
        } catch (error) {
            console.error('Error removing order item:', error);
            reply.status(500).send({ success: false, message: 'Failed to remove order item' });
        }
    }
}


"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CafeController = void 0;
const cafeService_1 = require("../services/cafeService");
class CafeController {
    constructor(db) {
        this.cafeService = new cafeService_1.CafeService(db);
    }
    async getMenuItems(request, reply) {
        try {
            const menuItems = await this.cafeService.getMenuItems();
            reply.send({ success: true, data: menuItems });
        }
        catch (error) {
            console.error('Error fetching menu items:', error);
            reply.status(500).send({ success: false, message: 'Failed to fetch menu items' });
        }
    }
    async getMenuItemById(request, reply) {
        try {
            const { id } = request.params;
            const menuItem = await this.cafeService.getMenuItemById(parseInt(id));
            if (!menuItem) {
                reply.status(404).send({ success: false, message: 'Menu item not found' });
                return;
            }
            reply.send({ success: true, data: menuItem });
        }
        catch (error) {
            console.error('Error fetching menu item:', error);
            reply.status(500).send({ success: false, message: 'Failed to fetch menu item' });
        }
    }
    async createMenuItem(request, reply) {
        try {
            const menuItemData = request.body;
            const menuItem = await this.cafeService.createMenuItem(menuItemData);
            reply.status(201).send({ success: true, data: menuItem });
        }
        catch (error) {
            console.error('Error creating menu item:', error);
            reply.status(500).send({ success: false, message: 'Failed to create menu item' });
        }
    }
    async updateMenuItem(request, reply) {
        try {
            const { id } = request.params;
            const updateData = request.body;
            const updated = await this.cafeService.updateMenuItem(parseInt(id), updateData);
            if (!updated) {
                reply.status(404).send({ success: false, message: 'Menu item not found' });
                return;
            }
            reply.send({ success: true, data: updated });
        }
        catch (error) {
            console.error('Error updating menu item:', error);
            reply.status(500).send({ success: false, message: 'Failed to update menu item' });
        }
    }
    async deleteMenuItem(request, reply) {
        try {
            const { id } = request.params;
            const deleted = await this.cafeService.deleteMenuItem(parseInt(id));
            if (!deleted) {
                reply.status(404).send({ success: false, message: 'Menu item not found' });
                return;
            }
            reply.send({ success: true, message: 'Menu item deleted successfully' });
        }
        catch (error) {
            console.error('Error deleting menu item:', error);
            reply.status(500).send({ success: false, message: 'Failed to delete menu item' });
        }
    }
    async getOrders(request, reply) {
        try {
            const orders = await this.cafeService.getOrders();
            reply.send({ success: true, data: orders });
        }
        catch (error) {
            console.error('Error fetching orders:', error);
            reply.status(500).send({ success: false, message: 'Failed to fetch orders' });
        }
    }
    async getOrderById(request, reply) {
        try {
            const { id } = request.params;
            const order = await this.cafeService.getOrderById(parseInt(id));
            if (!order) {
                reply.status(404).send({ success: false, message: 'Order not found' });
                return;
            }
            reply.send({ success: true, data: order });
        }
        catch (error) {
            console.error('Error fetching order:', error);
            reply.status(500).send({ success: false, message: 'Failed to fetch order' });
        }
    }
    async createOrder(request, reply) {
        try {
            const orderData = request.body;
            const order = await this.cafeService.createOrder(orderData);
            reply.status(201).send({ success: true, data: order });
        }
        catch (error) {
            console.error('Error creating order:', error);
            reply.status(500).send({ success: false, message: 'Failed to create order' });
        }
    }
    async updateOrder(request, reply) {
        try {
            const { id } = request.params;
            const updateData = request.body;
            const updated = await this.cafeService.updateOrder(parseInt(id), updateData);
            if (!updated) {
                reply.status(404).send({ success: false, message: 'Order not found' });
                return;
            }
            reply.send({ success: true, data: updated });
        }
        catch (error) {
            console.error('Error updating order:', error);
            reply.status(500).send({ success: false, message: 'Failed to update order' });
        }
    }
    async updateOrderStatus(request, reply) {
        try {
            const { id } = request.params;
            const { status } = request.body;
            const updated = await this.cafeService.updateOrderStatus(parseInt(id), status);
            if (!updated) {
                reply.status(404).send({ success: false, message: 'Order not found' });
                return;
            }
            reply.send({ success: true, data: updated });
        }
        catch (error) {
            console.error('Error updating order status:', error);
            reply.status(500).send({ success: false, message: 'Failed to update order status' });
        }
    }
    async deleteOrder(request, reply) {
        try {
            const { id } = request.params;
            const deleted = await this.cafeService.deleteOrder(parseInt(id));
            if (!deleted) {
                reply.status(404).send({ success: false, message: 'Order not found' });
                return;
            }
            reply.send({ success: true, message: 'Order deleted successfully' });
        }
        catch (error) {
            console.error('Error deleting order:', error);
            reply.status(500).send({ success: false, message: 'Failed to delete order' });
        }
    }
    async getOrderItems(request, reply) {
        try {
            const { id } = request.params;
            const items = await this.cafeService.getOrderItems(parseInt(id));
            reply.send({ success: true, data: items });
        }
        catch (error) {
            console.error('Error fetching order items:', error);
            reply.status(500).send({ success: false, message: 'Failed to fetch order items' });
        }
    }
    async addOrderItem(request, reply) {
        try {
            const { id } = request.params;
            const itemData = request.body;
            const item = await this.cafeService.addOrderItem(parseInt(id), itemData);
            reply.status(201).send({ success: true, data: item });
        }
        catch (error) {
            console.error('Error adding order item:', error);
            reply.status(500).send({ success: false, message: 'Failed to add order item' });
        }
    }
    async removeOrderItem(request, reply) {
        try {
            const { orderId, itemId } = request.params;
            const removed = await this.cafeService.removeOrderItem(parseInt(orderId), parseInt(itemId));
            if (!removed) {
                reply.status(404).send({ success: false, message: 'Order item not found' });
                return;
            }
            reply.send({ success: true, message: 'Order item removed successfully' });
        }
        catch (error) {
            console.error('Error removing order item:', error);
            reply.status(500).send({ success: false, message: 'Failed to remove order item' });
        }
    }
}
exports.CafeController = CafeController;
//# sourceMappingURL=cafeController.js.map
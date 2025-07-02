import { Pool } from 'pg';

export interface MenuItem {
    id?: number;
    name: string;
    description?: string;
    price: number;
    category: string;
    available?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Order {
    id?: number;
    customer_name: string;
    table_number?: string;
    total_amount: number;
    status: string;
    created_at?: string;
    updated_at?: string;
    items?: OrderItem[];
}

export interface OrderItem {
    id?: number;
    order_id: number;
    menu_item_id: number;
    quantity: number;
    price: number;
    created_at?: string;
    menu_item?: MenuItem;
}

export class CafeService {
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    // Menu Items CRUD
    async getMenuItems(): Promise<MenuItem[]> {
        const result = await this.db.query(
            'SELECT * FROM menu_items WHERE available = true ORDER BY category, name'
        );
        return result.rows;
    }

    async getMenuItemById(id: number): Promise<MenuItem | null> {
        const result = await this.db.query(
            'SELECT * FROM menu_items WHERE id = $1',
            [id]
        );
        return result.rows.length ? result.rows[0] : null;
    }

    async createMenuItem(menuItem: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem> {
        const result = await this.db.query(
            `INSERT INTO menu_items (name, description, price, category, available)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [
                menuItem.name,
                menuItem.description || '',
                menuItem.price,
                menuItem.category,
                menuItem.available !== false
            ]
        );
        return result.rows[0];
    }

    async updateMenuItem(id: number, updateData: Partial<MenuItem>): Promise<MenuItem | null> {
        const fields = [];
        const values = [];
        let paramCount = 1;

        if (updateData.name) {
            fields.push(`name = $${paramCount++}`);
            values.push(updateData.name);
        }
        if (updateData.description !== undefined) {
            fields.push(`description = $${paramCount++}`);
            values.push(updateData.description);
        }
        if (updateData.price !== undefined) {
            fields.push(`price = $${paramCount++}`);
            values.push(updateData.price);
        }
        if (updateData.category) {
            fields.push(`category = $${paramCount++}`);
            values.push(updateData.category);
        }
        if (updateData.available !== undefined) {
            fields.push(`available = $${paramCount++}`);
            values.push(updateData.available);
        }

        if (fields.length === 0) {
            return this.getMenuItemById(id);
        }

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `UPDATE menu_items SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
        const result = await this.db.query(query, values);
        
        return result.rows.length ? result.rows[0] : null;
    }

    async deleteMenuItem(id: number): Promise<boolean> {
        const result = await this.db.query(
            'UPDATE menu_items SET available = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
            [id]
        );
        return (result.rowCount || 0) > 0;
    }

    // Orders CRUD
    async getOrders(): Promise<Order[]> {
        const result = await this.db.query(`
            SELECT o.*, 
                   json_agg(
                       json_build_object(
                           'id', oi.id,
                           'menu_item_id', oi.menu_item_id,
                           'quantity', oi.quantity,
                           'price', oi.price,
                           'menu_item', json_build_object(
                               'id', mi.id,
                               'name', mi.name,
                               'category', mi.category
                           )
                       )
                   ) FILTER (WHERE oi.id IS NOT NULL) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `);
        return result.rows;
    }

    async getOrderById(id: number): Promise<Order | null> {
        const result = await this.db.query(`
            SELECT o.*, 
                   json_agg(
                       json_build_object(
                           'id', oi.id,
                           'menu_item_id', oi.menu_item_id,
                           'quantity', oi.quantity,
                           'price', oi.price,
                           'menu_item', json_build_object(
                               'id', mi.id,
                               'name', mi.name,
                               'category', mi.category
                           )
                       )
                   ) FILTER (WHERE oi.id IS NOT NULL) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
            WHERE o.id = $1
            GROUP BY o.id
        `, [id]);
        
        return result.rows.length ? result.rows[0] : null;
    }

    async createOrder(orderData: { customer_name: string; table_number?: string; items: { menu_item_id: number; quantity: number }[] }): Promise<Order> {
        const client = await this.db.connect();
        
        try {
            await client.query('BEGIN');

            // Calculate total amount
            let totalAmount = 0;
            for (const item of orderData.items) {
                const menuItem = await client.query(
                    'SELECT price FROM menu_items WHERE id = $1',
                    [item.menu_item_id]
                );
                if (menuItem.rows.length > 0) {
                    totalAmount += menuItem.rows[0].price * item.quantity;
                }
            }

            // Create order
            const orderResult = await client.query(
                `INSERT INTO orders (customer_name, table_number, total_amount, status)
                 VALUES ($1, $2, $3, $4) RETURNING *`,
                [orderData.customer_name, orderData.table_number, totalAmount, 'pending']
            );

            const order = orderResult.rows[0];

            // Add order items
            for (const item of orderData.items) {
                const menuItem = await client.query(
                    'SELECT price FROM menu_items WHERE id = $1',
                    [item.menu_item_id]
                );
                
                if (menuItem.rows.length > 0) {
                    await client.query(
                        `INSERT INTO order_items (order_id, menu_item_id, quantity, price)
                         VALUES ($1, $2, $3, $4)`,
                        [order.id, item.menu_item_id, item.quantity, menuItem.rows[0].price]
                    );
                }
            }

            await client.query('COMMIT');
            const createdOrder = await this.getOrderById(order.id);
            return createdOrder!;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async updateOrder(id: number, updateData: Partial<Order>): Promise<Order | null> {
        const fields = [];
        const values = [];
        let paramCount = 1;

        if (updateData.customer_name) {
            fields.push(`customer_name = $${paramCount++}`);
            values.push(updateData.customer_name);
        }
        if (updateData.table_number !== undefined) {
            fields.push(`table_number = $${paramCount++}`);
            values.push(updateData.table_number);
        }
        if (updateData.status) {
            fields.push(`status = $${paramCount++}`);
            values.push(updateData.status);
        }

        if (fields.length === 0) {
            return this.getOrderById(id);
        }

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `UPDATE orders SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
        const result = await this.db.query(query, values);
        
        return result.rows.length ? result.rows[0] : null;
    }

    async updateOrderStatus(id: number, status: string): Promise<Order | null> {
        const result = await this.db.query(
            'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [status, id]
        );
        return result.rows.length ? result.rows[0] : null;
    }

    async deleteOrder(id: number): Promise<boolean> {
        const result = await this.db.query(
            'DELETE FROM orders WHERE id = $1',
            [id]
        );
        return (result.rowCount || 0) > 0;
    }

    // Order Items
    async getOrderItems(orderId: number): Promise<OrderItem[]> {
        const result = await this.db.query(`
            SELECT oi.*, mi.name as menu_item_name, mi.category as menu_item_category
            FROM order_items oi
            JOIN menu_items mi ON oi.menu_item_id = mi.id
            WHERE oi.order_id = $1
            ORDER BY oi.created_at
        `, [orderId]);
        
        return result.rows;
    }

    async addOrderItem(orderId: number, itemData: { menu_item_id: number; quantity: number }): Promise<OrderItem> {
        const client = await this.db.connect();
        
        try {
            await client.query('BEGIN');

            // Get menu item price
            const menuItem = await client.query(
                'SELECT price FROM menu_items WHERE id = $1',
                [itemData.menu_item_id]
            );

            if (menuItem.rows.length === 0) {
                throw new Error('Menu item not found');
            }

            const price = menuItem.rows[0].price;

            // Add order item
            const result = await client.query(
                `INSERT INTO order_items (order_id, menu_item_id, quantity, price)
                 VALUES ($1, $2, $3, $4) RETURNING *`,
                [orderId, itemData.menu_item_id, itemData.quantity, price]
            );

            // Update order total
            await client.query(`
                UPDATE orders 
                SET total_amount = (
                    SELECT SUM(oi.quantity * oi.price) 
                    FROM order_items oi 
                    WHERE oi.order_id = $1
                ),
                updated_at = CURRENT_TIMESTAMP
                WHERE id = $1
            `, [orderId]);

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async removeOrderItem(orderId: number, itemId: number): Promise<boolean> {
        const client = await this.db.connect();
        
        try {
            await client.query('BEGIN');

            // Remove order item
            const result = await client.query(
                'DELETE FROM order_items WHERE id = $1 AND order_id = $2',
                [itemId, orderId]
            );

            if ((result.rowCount || 0) > 0) {
                // Update order total
                await client.query(`
                    UPDATE orders 
                    SET total_amount = COALESCE((
                        SELECT SUM(oi.quantity * oi.price) 
                        FROM order_items oi 
                        WHERE oi.order_id = $1
                    ), 0),
                    updated_at = CURRENT_TIMESTAMP
                    WHERE id = $1
                `, [orderId]);
            }

            await client.query('COMMIT');
            return (result.rowCount || 0) > 0;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}


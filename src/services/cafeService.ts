import { Pool } from 'pg';
import { CafeMenuItem, Order } from '../types';

export class CafeService {
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    async getMenuItems(): Promise<CafeMenuItem[]> {
        const result = await this.db.query('SELECT * FROM menu_items');
        return result.rows;
    }

    async createOrder(order: Order): Promise<Order> {
        const result = await this.db.query(
            'INSERT INTO orders (menu_item_id, quantity) VALUES ($1, $2) RETURNING *',
            [order.id, order.items]
        );
        return result.rows[0];
    }

    async getOrderById(orderId: number): Promise<Order | null> {
        const result = await this.db.query('SELECT * FROM orders WHERE id = $1', [orderId]);
        return result.rows.length ? result.rows[0] : null;
    }

    async processOrder(orderId: number): Promise<Order | null> {
        const result = await this.db.query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            ['completed', orderId]
        );
        return result.rows.length ? result.rows[0] : null;
    }
}
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
export declare class CafeService {
    private db;
    constructor(db: Pool);
    getMenuItems(): Promise<MenuItem[]>;
    getMenuItemById(id: number): Promise<MenuItem | null>;
    createMenuItem(menuItem: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem>;
    updateMenuItem(id: number, updateData: Partial<MenuItem>): Promise<MenuItem | null>;
    deleteMenuItem(id: number): Promise<boolean>;
    getOrders(): Promise<Order[]>;
    getOrderById(id: number): Promise<Order | null>;
    createOrder(orderData: {
        customer_name: string;
        table_number?: string;
        items: {
            menu_item_id: number;
            quantity: number;
        }[];
    }): Promise<Order>;
    updateOrder(id: number, updateData: Partial<Order>): Promise<Order | null>;
    updateOrderStatus(id: number, status: string): Promise<Order | null>;
    deleteOrder(id: number): Promise<boolean>;
    getOrderItems(orderId: number): Promise<OrderItem[]>;
    addOrderItem(orderId: number, itemData: {
        menu_item_id: number;
        quantity: number;
    }): Promise<OrderItem>;
    removeOrderItem(orderId: number, itemId: number): Promise<boolean>;
}
//# sourceMappingURL=cafeService.d.ts.map
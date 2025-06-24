export interface LightCommand {
    lightId: string;
    action: 'on' | 'off';
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}
export interface BilliardTableReservation {
    id: string;
    tableId: string;
    userId: string;
    startTime: string;
    endTime: string;
    status: 'booked' | 'completed' | 'canceled';
}
export interface CafeMenuItem {
    id: string;
    name: string;
    price: number;
    description?: string;
}
export interface Order {
    id: string;
    items: CafeMenuItem[];
    total: number;
    status: 'pending' | 'completed' | 'canceled';
}
//# sourceMappingURL=index.d.ts.map
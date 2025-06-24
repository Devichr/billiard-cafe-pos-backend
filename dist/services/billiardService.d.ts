import { Pool } from 'pg';
export interface BilliardReservation {
    id?: number;
    table_id: string;
    customer_name: string;
    start_time: string;
    end_time: string;
    status: string;
    created_at?: string;
    updated_at?: string;
}
export declare class BilliardService {
    private db;
    constructor(db: Pool);
    createReservation(reservation: Omit<BilliardReservation, 'id' | 'created_at' | 'updated_at'>): Promise<BilliardReservation>;
    getReservations(): Promise<BilliardReservation[]>;
    getReservationById(id: number): Promise<BilliardReservation | null>;
    updateReservationStatus(id: number, status: string): Promise<BilliardReservation | null>;
    updateReservation(id: number, updateData: Partial<BilliardReservation>): Promise<BilliardReservation | null>;
    deleteReservation(id: number): Promise<boolean>;
    getTableStatus(): Promise<any[]>;
}
//# sourceMappingURL=billiardService.d.ts.map
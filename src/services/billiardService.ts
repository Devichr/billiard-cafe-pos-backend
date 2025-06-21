import { Pool } from 'pg';
import { BilliardTableReservation } from '../types';
import { queryDB } from '../db';

export class BilliardService {
   private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    async createReservation(reservation: Omit<BilliardTableReservation, 'id' | 'status'>): Promise<BilliardTableReservation> {
        const result = await queryDB(
            `INSERT INTO reservations (table_id, user_id, start_time, end_time, status)
             VALUES ($1, $2, $3, $4, 'booked') RETURNING *`,
            [reservation.tableId, reservation.userId, reservation.startTime, reservation.endTime]
        );
        return result.rows[0];
    }

    async getReservations(): Promise<BilliardTableReservation[]> {
        const result = await queryDB('SELECT * FROM reservations');
        return result.rows;
    }

    async updateReservationStatus(id: string, status: 'booked' | 'completed' | 'canceled'): Promise<BilliardTableReservation> {
        const result = await queryDB(
            'UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        return result.rows[0];
    }
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BilliardService = void 0;
class BilliardService {
    constructor(db) {
        this.db = db;
    }
    async createReservation(reservation) {
        const result = await this.db.query(`INSERT INTO reservations (table_id, customer_name, start_time, end_time, status)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`, [
            reservation.table_id,
            reservation.customer_name,
            reservation.start_time,
            reservation.end_time,
            reservation.status || 'reserved'
        ]);
        return result.rows[0];
    }
    async getReservations() {
        const result = await this.db.query('SELECT * FROM reservations ORDER BY created_at DESC');
        return result.rows;
    }
    async getReservationById(id) {
        const result = await this.db.query('SELECT * FROM reservations WHERE id = $1', [id]);
        return result.rows.length ? result.rows[0] : null;
    }
    async updateReservationStatus(id, status) {
        const result = await this.db.query('UPDATE reservations SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *', [status, id]);
        return result.rows.length ? result.rows[0] : null;
    }
    async updateReservation(id, updateData) {
        const fields = [];
        const values = [];
        let paramCount = 1;
        if (updateData.table_id) {
            fields.push(`table_id = $${paramCount++}`);
            values.push(updateData.table_id);
        }
        if (updateData.customer_name) {
            fields.push(`customer_name = $${paramCount++}`);
            values.push(updateData.customer_name);
        }
        if (updateData.start_time) {
            fields.push(`start_time = $${paramCount++}`);
            values.push(updateData.start_time);
        }
        if (updateData.end_time) {
            fields.push(`end_time = $${paramCount++}`);
            values.push(updateData.end_time);
        }
        if (updateData.status) {
            fields.push(`status = $${paramCount++}`);
            values.push(updateData.status);
        }
        if (fields.length === 0) {
            return this.getReservationById(id);
        }
        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);
        const query = `UPDATE reservations SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
        const result = await this.db.query(query, values);
        return result.rows.length ? result.rows[0] : null;
    }
    async deleteReservation(id) {
        const result = await this.db.query('DELETE FROM reservations WHERE id = $1', [id]);
        return (result.rowCount || 0) > 0;
    }
    async getTableStatus() {
        const result = await this.db.query(`
            SELECT 
                table_id,
                COUNT(*) as total_reservations,
                COUNT(CASE WHEN status = 'active' THEN 1 END) as active_reservations,
                COUNT(CASE WHEN status = 'reserved' THEN 1 END) as reserved_reservations,
                MAX(CASE WHEN status = 'active' THEN start_time END) as current_session_start
            FROM reservations 
            WHERE table_id IN ('Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6', 'Table 7', 'Table 8')
            GROUP BY table_id
            ORDER BY table_id
        `);
        const allTables = [];
        for (let i = 1; i <= 8; i++) {
            const tableId = `Table ${i}`;
            const tableData = result.rows.find(row => row.table_id === tableId);
            allTables.push({
                table_id: tableId,
                total_reservations: tableData ? parseInt(tableData.total_reservations) : 0,
                active_reservations: tableData ? parseInt(tableData.active_reservations) : 0,
                reserved_reservations: tableData ? parseInt(tableData.reserved_reservations) : 0,
                current_session_start: tableData ? tableData.current_session_start : null,
                status: tableData && parseInt(tableData.active_reservations) > 0 ? 'occupied' :
                    tableData && parseInt(tableData.reserved_reservations) > 0 ? 'reserved' : 'available'
            });
        }
        return allTables;
    }
}
exports.BilliardService = BilliardService;
//# sourceMappingURL=billiardService.js.map
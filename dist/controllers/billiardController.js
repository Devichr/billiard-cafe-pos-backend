"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BilliardController = void 0;
const billiardService_1 = require("../services/billiardService");
class BilliardController {
    constructor(db) {
        this.billiardService = new billiardService_1.BilliardService(db);
    }
    async createReservation(request, reply) {
        try {
            const reservationData = request.body;
            const reservation = await this.billiardService.createReservation(reservationData);
            reply.status(201).send({ success: true, data: reservation });
        }
        catch (error) {
            console.error('Error creating reservation:', error);
            reply.status(500).send({ success: false, message: 'Failed to create reservation' });
        }
    }
    async getReservations(request, reply) {
        try {
            const reservations = await this.billiardService.getReservations();
            reply.send({ success: true, data: reservations });
        }
        catch (error) {
            console.error('Error fetching reservations:', error);
            reply.status(500).send({ success: false, message: 'Failed to fetch reservations' });
        }
    }
    async getReservationById(request, reply) {
        try {
            const { id } = request.params;
            const reservation = await this.billiardService.getReservationById(parseInt(id));
            if (!reservation) {
                reply.status(404).send({ success: false, message: 'Reservation not found' });
                return;
            }
            reply.send({ success: true, data: reservation });
        }
        catch (error) {
            console.error('Error fetching reservation:', error);
            reply.status(500).send({ success: false, message: 'Failed to fetch reservation' });
        }
    }
    async updateReservationStatus(request, reply) {
        try {
            const { id, status } = request.body;
            const updated = await this.billiardService.updateReservationStatus(id, status);
            if (!updated) {
                reply.status(404).send({ success: false, message: 'Reservation not found' });
                return;
            }
            reply.send({ success: true, data: updated });
        }
        catch (error) {
            console.error('Error updating reservation status:', error);
            reply.status(500).send({ success: false, message: 'Failed to update reservation status' });
        }
    }
    async updateReservation(request, reply) {
        try {
            const { id } = request.params;
            const updateData = request.body;
            const updated = await this.billiardService.updateReservation(parseInt(id), updateData);
            if (!updated) {
                reply.status(404).send({ success: false, message: 'Reservation not found' });
                return;
            }
            reply.send({ success: true, data: updated });
        }
        catch (error) {
            console.error('Error updating reservation:', error);
            reply.status(500).send({ success: false, message: 'Failed to update reservation' });
        }
    }
    async deleteReservation(request, reply) {
        try {
            const { id } = request.params;
            const deleted = await this.billiardService.deleteReservation(parseInt(id));
            if (!deleted) {
                reply.status(404).send({ success: false, message: 'Reservation not found' });
                return;
            }
            reply.send({ success: true, message: 'Reservation deleted successfully' });
        }
        catch (error) {
            console.error('Error deleting reservation:', error);
            reply.status(500).send({ success: false, message: 'Failed to delete reservation' });
        }
    }
    async getTableStatus(request, reply) {
        try {
            const tableStatus = await this.billiardService.getTableStatus();
            reply.send({ success: true, data: tableStatus });
        }
        catch (error) {
            console.error('Error fetching table status:', error);
            reply.status(500).send({ success: false, message: 'Failed to fetch table status' });
        }
    }
}
exports.BilliardController = BilliardController;
//# sourceMappingURL=billiardController.js.map
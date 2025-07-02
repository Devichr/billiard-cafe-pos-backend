"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Esp32Controller = void 0;
const esp32Service_1 = require("../services/esp32Service");
class Esp32Controller {
    constructor(db) {
        this.esp32Service = new esp32Service_1.Esp32Service(db);
    }
    async getLights(request, reply) {
        try {
            const lights = await this.esp32Service.getLights();
            reply.send({ success: true, data: lights });
        }
        catch (error) {
            console.error('Error fetching lights:', error);
            reply.status(500).send({ success: false, message: 'Failed to fetch lights' });
        }
    }
    async getLightById(request, reply) {
        try {
            const { id } = request.params;
            const light = await this.esp32Service.getLightById(parseInt(id));
            if (!light) {
                reply.status(404).send({ success: false, message: 'Light not found' });
                return;
            }
            reply.send({ success: true, data: light });
        }
        catch (error) {
            console.error('Error fetching light:', error);
            reply.status(500).send({ success: false, message: 'Failed to fetch light' });
        }
    }
    async createLight(request, reply) {
        try {
            const lightData = request.body;
            const light = await this.esp32Service.createLight(lightData);
            reply.status(201).send({ success: true, data: light });
        }
        catch (error) {
            console.error('Error creating light:', error);
            reply.status(500).send({ success: false, message: 'Failed to create light' });
        }
    }
    async updateLight(request, reply) {
        try {
            const { id } = request.params;
            const updateData = request.body;
            const updated = await this.esp32Service.updateLight(parseInt(id), updateData);
            if (!updated) {
                reply.status(404).send({ success: false, message: 'Light not found' });
                return;
            }
            reply.send({ success: true, data: updated });
        }
        catch (error) {
            console.error('Error updating light:', error);
            reply.status(500).send({ success: false, message: 'Failed to update light' });
        }
    }
    async deleteLight(request, reply) {
        try {
            const { id } = request.params;
            const deleted = await this.esp32Service.deleteLight(parseInt(id));
            if (!deleted) {
                reply.status(404).send({ success: false, message: 'Light not found' });
                return;
            }
            reply.send({ success: true, message: 'Light deleted successfully' });
        }
        catch (error) {
            console.error('Error deleting light:', error);
            reply.status(500).send({ success: false, message: 'Failed to delete light' });
        }
    }
    async controlLight(request, reply) {
        try {
            const { id } = request.params;
            const { action } = request.body;
            const result = await this.esp32Service.controlLight(parseInt(id), action);
            if (!result) {
                reply.status(404).send({ success: false, message: 'Light not found' });
                return;
            }
            reply.send({
                success: true,
                data: result,
                message: `Light ${id} turned ${action}`
            });
        }
        catch (error) {
            console.error('Error controlling light:', error);
            reply.status(500).send({ success: false, message: 'Failed to control light' });
        }
    }
    async updateBrightness(request, reply) {
        try {
            const { id } = request.params;
            const { brightness } = request.body;
            const result = await this.esp32Service.updateBrightness(parseInt(id), brightness);
            if (!result) {
                reply.status(404).send({ success: false, message: 'Light not found' });
                return;
            }
            reply.send({ success: true, data: result });
        }
        catch (error) {
            console.error('Error updating brightness:', error);
            reply.status(500).send({ success: false, message: 'Failed to update brightness' });
        }
    }
    async applyPreset(request, reply) {
        try {
            const { preset } = request.body;
            const result = await this.esp32Service.applyPreset(preset);
            reply.send({
                success: true,
                data: result,
                message: `Preset "${preset}" applied successfully`
            });
        }
        catch (error) {
            console.error('Error applying preset:', error);
            reply.status(500).send({ success: false, message: 'Failed to apply preset' });
        }
    }
    async getSystemStatus(request, reply) {
        try {
            const status = await this.esp32Service.getSystemStatus();
            reply.send({ success: true, data: status });
        }
        catch (error) {
            console.error('Error fetching system status:', error);
            reply.status(500).send({ success: false, message: 'Failed to fetch system status' });
        }
    }
    async getPowerConsumption(request, reply) {
        try {
            const consumption = await this.esp32Service.getPowerConsumption();
            reply.send({ success: true, data: consumption });
        }
        catch (error) {
            console.error('Error fetching power consumption:', error);
            reply.status(500).send({ success: false, message: 'Failed to fetch power consumption' });
        }
    }
}
exports.Esp32Controller = Esp32Controller;
//# sourceMappingURL=esp32Controller.js.map
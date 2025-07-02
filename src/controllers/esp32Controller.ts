import { FastifyReply, FastifyRequest } from 'fastify';
import { Esp32Service } from '../services/esp32Service';
import { Pool } from 'pg';

export class Esp32Controller {
    private esp32Service: Esp32Service;

    constructor(db: Pool) {
        this.esp32Service = new Esp32Service(db);
    }

    // Lights CRUD
    async getLights(request: FastifyRequest, reply: FastifyReply) {
        try {
            const lights = await this.esp32Service.getLights();
            reply.send({ success: true, data: lights });
        } catch (error) {
            console.error('Error fetching lights:', error);
            reply.status(500).send({ success: false, message: 'Failed to fetch lights' });
        }
    }

    async getLightById(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const light = await this.esp32Service.getLightById(parseInt(id));
            
            if (!light) {
                reply.status(404).send({ success: false, message: 'Light not found' });
                return;
            }
            
            reply.send({ success: true, data: light });
        } catch (error) {
            console.error('Error fetching light:', error);
            reply.status(500).send({ success: false, message: 'Failed to fetch light' });
        }
    }

    async createLight(request: FastifyRequest, reply: FastifyReply) {
        try {
            const lightData = request.body as any;
            const light = await this.esp32Service.createLight(lightData);
            reply.status(201).send({ success: true, data: light });
        } catch (error) {
            console.error('Error creating light:', error);
            reply.status(500).send({ success: false, message: 'Failed to create light' });
        }
    }

    async updateLight(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const updateData = request.body as any;
            const updated = await this.esp32Service.updateLight(parseInt(id), updateData);
            
            if (!updated) {
                reply.status(404).send({ success: false, message: 'Light not found' });
                return;
            }
            
            reply.send({ success: true, data: updated });
        } catch (error) {
            console.error('Error updating light:', error);
            reply.status(500).send({ success: false, message: 'Failed to update light' });
        }
    }

    async deleteLight(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const deleted = await this.esp32Service.deleteLight(parseInt(id));
            
            if (!deleted) {
                reply.status(404).send({ success: false, message: 'Light not found' });
                return;
            }
            
            reply.send({ success: true, message: 'Light deleted successfully' });
        } catch (error) {
            console.error('Error deleting light:', error);
            reply.status(500).send({ success: false, message: 'Failed to delete light' });
        }
    }

    // Light Control
    async controlLight(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const { action } = request.body as { action: 'on' | 'off' };
            
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
        } catch (error) {
            console.error('Error controlling light:', error);
            reply.status(500).send({ success: false, message: 'Failed to control light' });
        }
    }

    async updateBrightness(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const { brightness } = request.body as { brightness: number };
            
            const result = await this.esp32Service.updateBrightness(parseInt(id), brightness);
            
            if (!result) {
                reply.status(404).send({ success: false, message: 'Light not found' });
                return;
            }
            
            reply.send({ success: true, data: result });
        } catch (error) {
            console.error('Error updating brightness:', error);
            reply.status(500).send({ success: false, message: 'Failed to update brightness' });
        }
    }

    async applyPreset(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { preset } = request.body as { preset: string };
            const result = await this.esp32Service.applyPreset(preset);
            reply.send({ 
                success: true, 
                data: result,
                message: `Preset "${preset}" applied successfully` 
            });
        } catch (error) {
            console.error('Error applying preset:', error);
            reply.status(500).send({ success: false, message: 'Failed to apply preset' });
        }
    }

    // System Status
    async getSystemStatus(request: FastifyRequest, reply: FastifyReply) {
        try {
            const status = await this.esp32Service.getSystemStatus();
            reply.send({ success: true, data: status });
        } catch (error) {
            console.error('Error fetching system status:', error);
            reply.status(500).send({ success: false, message: 'Failed to fetch system status' });
        }
    }

    async getPowerConsumption(request: FastifyRequest, reply: FastifyReply) {
        try {
            const consumption = await this.esp32Service.getPowerConsumption();
            reply.send({ success: true, data: consumption });
        } catch (error) {
            console.error('Error fetching power consumption:', error);
            reply.status(500).send({ success: false, message: 'Failed to fetch power consumption' });
        }
    }
}


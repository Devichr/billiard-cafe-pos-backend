import { FastifyInstance } from 'fastify';
import { Esp32Controller } from '../controllers/esp32Controller';

export const setEsp32Routes = (app: FastifyInstance) => {
    const esp32Controller = new Esp32Controller();

    app.post('/api/esp32/light/:id', async (request, reply) => {
        const lightId = (request.params as any).id;
        const { action } = request.body as { action: 'on' | 'off' };

        try {
            await esp32Controller.controlLight(lightId, action);
            reply.send({ message: `Light ${lightId} turned ${action}` });
        } catch (error) {
            reply.status(500).send({ error: 'Failed to control light' });
        }
    });
};
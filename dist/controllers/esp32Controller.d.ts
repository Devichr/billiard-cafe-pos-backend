import { FastifyReply, FastifyRequest } from 'fastify';
import { Pool } from 'pg';
export declare class Esp32Controller {
    private esp32Service;
    constructor(db: Pool);
    getLights(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getLightById(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    createLight(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    updateLight(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    deleteLight(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    controlLight(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    updateBrightness(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    applyPreset(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getSystemStatus(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getPowerConsumption(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}
//# sourceMappingURL=esp32Controller.d.ts.map
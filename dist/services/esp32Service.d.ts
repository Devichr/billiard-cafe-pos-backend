import { Pool } from 'pg';
export interface Light {
    id?: number;
    name: string;
    location: string;
    status: string;
    brightness: number;
    power_consumption: number;
    created_at?: string;
    updated_at?: string;
}
export declare class Esp32Service {
    private db;
    constructor(db: Pool);
    getLights(): Promise<Light[]>;
    getLightById(id: number): Promise<Light | null>;
    createLight(light: Omit<Light, 'id' | 'created_at' | 'updated_at'>): Promise<Light>;
    updateLight(id: number, updateData: Partial<Light>): Promise<Light | null>;
    deleteLight(id: number): Promise<boolean>;
    controlLight(id: number, action: 'on' | 'off'): Promise<Light | null>;
    updateBrightness(id: number, brightness: number): Promise<Light | null>;
    applyPreset(preset: string): Promise<Light[]>;
    getSystemStatus(): Promise<any>;
    getPowerConsumption(): Promise<any>;
}
//# sourceMappingURL=esp32Service.d.ts.map
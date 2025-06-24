"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Esp32Service = void 0;
class Esp32Service {
    constructor(db) {
        this.db = db;
    }
    async getLights() {
        const result = await this.db.query('SELECT * FROM lights ORDER BY location, name');
        return result.rows;
    }
    async getLightById(id) {
        const result = await this.db.query('SELECT * FROM lights WHERE id = $1', [id]);
        return result.rows.length ? result.rows[0] : null;
    }
    async createLight(light) {
        const result = await this.db.query(`INSERT INTO lights (name, location, status, brightness, power_consumption)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`, [
            light.name,
            light.location,
            light.status || 'off',
            light.brightness || 100,
            light.power_consumption || 0.0
        ]);
        return result.rows[0];
    }
    async updateLight(id, updateData) {
        const fields = [];
        const values = [];
        let paramCount = 1;
        if (updateData.name) {
            fields.push(`name = $${paramCount++}`);
            values.push(updateData.name);
        }
        if (updateData.location) {
            fields.push(`location = $${paramCount++}`);
            values.push(updateData.location);
        }
        if (updateData.status) {
            fields.push(`status = $${paramCount++}`);
            values.push(updateData.status);
        }
        if (updateData.brightness !== undefined) {
            fields.push(`brightness = $${paramCount++}`);
            values.push(updateData.brightness);
        }
        if (updateData.power_consumption !== undefined) {
            fields.push(`power_consumption = $${paramCount++}`);
            values.push(updateData.power_consumption);
        }
        if (fields.length === 0) {
            return this.getLightById(id);
        }
        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);
        const query = `UPDATE lights SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
        const result = await this.db.query(query, values);
        return result.rows.length ? result.rows[0] : null;
    }
    async deleteLight(id) {
        const result = await this.db.query('DELETE FROM lights WHERE id = $1', [id]);
        return (result.rowCount || 0) > 0;
    }
    async controlLight(id, action) {
        const result = await this.db.query('UPDATE lights SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *', [action, id]);
        console.log(`ESP32 Command: Light ${id} turned ${action}`);
        return result.rows.length ? result.rows[0] : null;
    }
    async updateBrightness(id, brightness) {
        const validBrightness = Math.max(0, Math.min(100, brightness));
        const result = await this.db.query('UPDATE lights SET brightness = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *', [validBrightness, id]);
        console.log(`ESP32 Command: Light ${id} brightness set to ${validBrightness}%`);
        return result.rows.length ? result.rows[0] : null;
    }
    async applyPreset(preset) {
        let query = '';
        let params = [];
        switch (preset.toLowerCase()) {
            case 'all_on':
                query = `UPDATE lights SET status = 'on', brightness = 100, updated_at = CURRENT_TIMESTAMP RETURNING *`;
                break;
            case 'all_off':
                query = `UPDATE lights SET status = 'off', updated_at = CURRENT_TIMESTAMP RETURNING *`;
                break;
            case 'tables_only':
                query = `UPDATE lights SET 
                        status = CASE WHEN location LIKE 'Table%' THEN 'on' ELSE 'off' END,
                        brightness = CASE WHEN location LIKE 'Table%' THEN 100 ELSE brightness END,
                        updated_at = CURRENT_TIMESTAMP 
                        RETURNING *`;
                break;
            case 'ambient':
                query = `UPDATE lights SET 
                        status = 'on',
                        brightness = CASE 
                            WHEN location LIKE 'Table%' THEN 60
                            WHEN location = 'Main Hall' THEN 40
                            WHEN location = 'Bar Area' THEN 70
                            ELSE 30
                        END,
                        updated_at = CURRENT_TIMESTAMP 
                        RETURNING *`;
                break;
            default:
                throw new Error(`Unknown preset: ${preset}`);
        }
        const result = await this.db.query(query, params);
        console.log(`ESP32 Command: Applied preset "${preset}" to all lights`);
        return result.rows;
    }
    async getSystemStatus() {
        const lightsResult = await this.db.query(`
            SELECT 
                COUNT(*) as total_lights,
                COUNT(CASE WHEN status = 'on' THEN 1 END) as lights_on,
                COUNT(CASE WHEN status = 'off' THEN 1 END) as lights_off,
                AVG(brightness) as average_brightness,
                SUM(CASE WHEN status = 'on' THEN power_consumption ELSE 0 END) as total_power_consumption
            FROM lights
        `);
        const stats = lightsResult.rows[0];
        return {
            esp32_module: {
                status: 'connected',
                ip_address: '192.168.1.100',
                last_ping: new Date().toISOString(),
                uptime: '24h 15m 30s'
            },
            lights: {
                total: parseInt(stats.total_lights),
                on: parseInt(stats.lights_on),
                off: parseInt(stats.lights_off),
                average_brightness: parseFloat(stats.average_brightness || 0).toFixed(1)
            },
            power: {
                total_consumption: parseFloat(stats.total_power_consumption || 0).toFixed(2),
                estimated_cost_per_hour: (parseFloat(stats.total_power_consumption || 0) * 0.15).toFixed(2)
            },
            system: {
                temperature: '28°C',
                memory_usage: '45%',
                wifi_signal: '-45 dBm'
            }
        };
    }
    async getPowerConsumption() {
        const result = await this.db.query(`
            SELECT 
                name,
                location,
                status,
                brightness,
                power_consumption,
                CASE WHEN status = 'on' THEN power_consumption ELSE 0 END as current_consumption
            FROM lights
            ORDER BY location, name
        `);
        const lights = result.rows;
        const totalConsumption = lights.reduce((sum, light) => sum + parseFloat(light.current_consumption), 0);
        return {
            lights: lights.map(light => ({
                id: light.id,
                name: light.name,
                location: light.location,
                status: light.status,
                brightness: light.brightness,
                rated_power: parseFloat(light.power_consumption),
                current_consumption: parseFloat(light.current_consumption)
            })),
            summary: {
                total_consumption: totalConsumption.toFixed(2),
                estimated_cost_per_hour: (totalConsumption * 0.15).toFixed(2),
                estimated_cost_per_day: (totalConsumption * 0.15 * 24).toFixed(2),
                carbon_footprint: (totalConsumption * 0.5).toFixed(2)
            }
        };
    }
}
exports.Esp32Service = Esp32Service;
//# sourceMappingURL=esp32Service.js.map
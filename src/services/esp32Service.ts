import axios from 'axios';

export class Esp32Service {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    public async turnOnLight(lightId: string): Promise<void> {
        try {
            await axios.post(`${this.baseUrl}/lights/on`, { lightId });
        } catch (error) {
            console.error(`Error turning on light ${lightId}:`, error);
            throw new Error('Failed to turn on light');
        }
    }

    public async turnOffLight(lightId: string): Promise<void> {
        try {
            await axios.post(`${this.baseUrl}/lights/off`, { lightId });
        } catch (error) {
            console.error(`Error turning off light ${lightId}:`, error);
            throw new Error('Failed to turn off light');
        }
    }
}
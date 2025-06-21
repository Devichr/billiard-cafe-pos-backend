import { Esp32Service } from '../services/esp32Service';

export class Esp32Controller {
    private esp32Service: Esp32Service;

    constructor() {
        this.esp32Service = new Esp32Service('http://esp32.local'); // Adjust baseUrl as needed
    }

    public async controlLight(lightId: string, action: 'on' | 'off') {
        if (action === 'on') {
            await this.esp32Service.turnOnLight(lightId);
        } else {
            await this.esp32Service.turnOffLight(lightId);
        }
    }
}
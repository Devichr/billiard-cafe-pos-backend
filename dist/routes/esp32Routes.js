"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEsp32Routes = void 0;
const esp32Controller_1 = require("../controllers/esp32Controller");
const setEsp32Routes = async (app, options) => {
    const { db } = options;
    const esp32Controller = new esp32Controller_1.Esp32Controller(db);
    app.get('/api/esp32/lights', esp32Controller.getLights.bind(esp32Controller));
    app.get('/api/esp32/lights/:id', esp32Controller.getLightById.bind(esp32Controller));
    app.post('/api/esp32/lights', esp32Controller.createLight.bind(esp32Controller));
    app.put('/api/esp32/lights/:id', esp32Controller.updateLight.bind(esp32Controller));
    app.delete('/api/esp32/lights/:id', esp32Controller.deleteLight.bind(esp32Controller));
    app.post('/api/esp32/light/:id', esp32Controller.controlLight.bind(esp32Controller));
    app.patch('/api/esp32/lights/:id/brightness', esp32Controller.updateBrightness.bind(esp32Controller));
    app.post('/api/esp32/lights/preset', esp32Controller.applyPreset.bind(esp32Controller));
    app.get('/api/esp32/status', esp32Controller.getSystemStatus.bind(esp32Controller));
    app.get('/api/esp32/power-consumption', esp32Controller.getPowerConsumption.bind(esp32Controller));
};
exports.setEsp32Routes = setEsp32Routes;
//# sourceMappingURL=esp32Routes.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const billiardRoutes_1 = require("./routes/billiardRoutes");
const cafeRoutes_1 = require("./routes/cafeRoutes");
const esp32Routes_1 = require("./routes/esp32Routes");
const app = (0, fastify_1.default)({ logger: true });
app.register(billiardRoutes_1.setBilliardRoutes);
app.register(cafeRoutes_1.setCafeRoutes);
app.register(esp32Routes_1.setEsp32Routes);
app.listen({ port: 3000 }, (err, address) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    app.log.info(`Server listening at ${address}`);
});
//# sourceMappingURL=app.js.map
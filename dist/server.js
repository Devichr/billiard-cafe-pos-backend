"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const pg_1 = require("pg");
const billiardRoutes_1 = require("./routes/billiardRoutes");
const cafeRoutes_1 = require("./routes/cafeRoutes");
const esp32Routes_1 = require("./routes/esp32Routes");
const schema_1 = require("./db/schema");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const server = (0, fastify_1.default)({
    logger: true,
    disableRequestLogging: false
});
server.register(require('@fastify/cors'), {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
});
const db = new pg_1.Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'billiard_cafe',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT || '5432'),
});
db.connect()
    .then(() => {
    console.log('Connected to PostgreSQL database');
    return (0, schema_1.initializeDatabase)(db);
})
    .then(() => {
    console.log('Database schema initialized');
})
    .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
});
server.get('/api/health', async (request, reply) => {
    return { status: 'OK', timestamp: new Date().toISOString() };
});
server.register(billiardRoutes_1.setBilliardRoutes, { db });
server.register(cafeRoutes_1.setCafeRoutes, { db });
server.register(esp32Routes_1.setEsp32Routes, { db });
const start = async () => {
    try {
        await server.listen({
            port: parseInt(process.env.PORT || '3000'),
            host: '0.0.0.0'
        });
        console.log(`Server is running at http://0.0.0.0:${process.env.PORT || 3000}`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await db.end();
    process.exit(0);
});
start();
//# sourceMappingURL=server.js.map
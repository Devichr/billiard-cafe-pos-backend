"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.queryDB = exports.connectDB = void 0;
const pg_1 = require("pg");
const client = new pg_1.Client({
    user: 'dchr',
    host: 'localhost',
    database: 'billiard_cafe',
    password: 'rajawali',
    port: 5432,
});
const connectDB = async () => {
    try {
        await client.connect();
        console.log('Connected to PostgreSQL database');
    }
    catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};
exports.connectDB = connectDB;
const queryDB = async (text, params) => {
    try {
        const res = await client.query(text, params);
        return res;
    }
    catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};
exports.queryDB = queryDB;
const disconnectDB = async () => {
    try {
        await client.end();
        console.log('Disconnected from PostgreSQL database');
    }
    catch (error) {
        console.error('Error disconnecting from database:', error);
        throw error;
    }
};
exports.disconnectDB = disconnectDB;
//# sourceMappingURL=index.js.map
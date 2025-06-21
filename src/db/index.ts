import { Client } from 'pg';

const client = new Client({
    user: 'dchr',
    host: 'localhost',
    database: 'billiard_cafe',
    password: 'rajawali',
    port: 5432,
});

export const connectDB = async () => {
    try {
        await client.connect();
        console.log('Connected to PostgreSQL database');
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};

export const queryDB = async (text: string, params?: any[]) => {
    try {
        const res = await client.query(text, params);
        return res;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

export const disconnectDB = async () => {
    try {
        await client.end();
        console.log('Disconnected from PostgreSQL database');
    } catch (error) {
        console.error('Error disconnecting from database:', error);
        throw error;
    }
};
import fastify from 'fastify';
import { Pool } from 'pg';
import { setBilliardRoutes } from './routes/billiardRoutes';
import { setCafeRoutes } from './routes/cafeRoutes';
import { setEsp32Routes } from './routes/esp32Routes';
import { initializeDatabase } from './db/schema';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const server = fastify({ 
  logger: true,
  disableRequestLogging: false
});

// Enable CORS
server.register(require('@fastify/cors'), {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

// Database connection
const db = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'billiard_cafe',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Test database connection
db.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');
    // Initialize database schema
    return initializeDatabase(db);
  })
  .then(() => {
    console.log('Database schema initialized');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

// Health check endpoint
server.get('/api/health', async (request, reply) => {
  return { status: 'OK', timestamp: new Date().toISOString() };
});

// Register routes with database connection
server.register(setBilliardRoutes, { db });
server.register(setCafeRoutes, { db });
server.register(setEsp32Routes, { db });

const start = async () => {
  try {
    await server.listen({ 
      port: parseInt(process.env.PORT || '3000'),
      host: 'localhost'
    });
    console.log(`Server is running at http://localhost:${process.env.PORT || 3000}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await db.end();
  process.exit(0);
});

start();


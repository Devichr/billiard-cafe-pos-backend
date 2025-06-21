import fastify from 'fastify';
import { setBilliardRoutes } from './routes/billiardRoutes';
import { setCafeRoutes } from './routes/cafeRoutes';
import { setEsp32Routes } from './routes/esp32Routes';

const server = fastify({ logger: true });

server.register(setBilliardRoutes);
server.register(setCafeRoutes);
server.register(setEsp32Routes);

const start = async () => {
  try {
    await server.listen(3000);
    console.log(`Server is running at http://localhost:3000`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
import fastify from 'fastify';
import { setBilliardRoutes } from './routes/billiardRoutes';
import { setCafeRoutes } from './routes/cafeRoutes';
import { setEsp32Routes } from './routes/esp32Routes';

const app = fastify({ logger: true });

app.register(setBilliardRoutes);
app.register(setCafeRoutes);
app.register(setEsp32Routes);

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening at ${address}`);
});
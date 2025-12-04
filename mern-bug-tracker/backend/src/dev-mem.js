const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('./app');

async function start() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  await mongoose.connect(uri);
  const port = process.env.PORT || 5000;
  const server = app.listen(port, () => {
    console.log(`Dev server with in-memory MongoDB listening on ${port}`);
  });

  const shutdown = async () => {
    console.log('Shutting down dev-mem server');
    await mongoose.disconnect();
    await mongod.stop();
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start().catch((err) => {
  console.error('Failed to start dev mem server', err);
  process.exit(1);
});

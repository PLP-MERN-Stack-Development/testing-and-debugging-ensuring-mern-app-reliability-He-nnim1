const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
let app;
let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  app = require('../../src/app');
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

test('create and list bugs', async () => {
  const createRes = await request(app).post('/api/bugs').send({ title: 'Test bug', description: 'desc' });
  expect(createRes.status).toBe(201);
  expect(createRes.body.title).toBe('Test bug');

  const listRes = await request(app).get('/api/bugs');
  expect(listRes.status).toBe(200);
  expect(Array.isArray(listRes.body)).toBe(true);
  expect(listRes.body.length).toBe(1);
});

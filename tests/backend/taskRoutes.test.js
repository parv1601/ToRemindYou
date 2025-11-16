import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../backend/server.js';
import Task from '../../backend/models/Task.js';

describe('Task Routes', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/toremindyou_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await Task.deleteMany({});
  });

  afterAll(async () => {
    await Task.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task with valid data', async () => {
      const taskData = { name: 'Test Task', recurrenceDays: 3 };
      const res = await request(app).post('/api/tasks').send(taskData);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toBe(taskData.name);
      expect(res.body.recurrenceDays).toBe(taskData.recurrenceDays);
      expect(res.body).toHaveProperty('lastSentDate');
    });

    it('should reject invalid task data', async () => {
      const invalidData = { name: '', recurrenceDays: 0 };
      const res = await request(app).post('/api/tasks').send(invalidData);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/tasks', () => {
    it('should return an array of tasks', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty('name');
        expect(res.body[0]).toHaveProperty('recurrenceDays');
        expect(res.body[0]).toHaveProperty('lastSentDate');
      }
    });
  });
});

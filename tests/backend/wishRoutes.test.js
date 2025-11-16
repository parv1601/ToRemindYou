import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../backend/server.js';
import Wish from '../../backend/models/Wish.js';
import * as emailService from '../../backend/utils/emailService.js';

jest.mock('../../backend/utils/emailService.js');

describe('Wish Routes', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/toremindyou_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await Wish.deleteMany({});
  });

  afterAll(async () => {
    await Wish.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(() => {
    emailService.sendWishEmail.mockClear();
  });

  it('POST /api/wishes should save wish and send email', async () => {
    emailService.sendWishEmail.mockResolvedValue();

    const wishMessage = 'Wishing for great success!';
    const res = await request(app).post('/api/wishes').send({ message: wishMessage });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(emailService.sendWishEmail).toHaveBeenCalledTimes(1);
    expect(emailService.sendWishEmail).toHaveBeenCalledWith(expect.objectContaining({ message: wishMessage }));

    const savedWish = await Wish.findOne({ message: wishMessage });
    expect(savedWish).not.toBeNull();
  });

  it('POST /api/wishes with invalid message should return 400', async () => {
    const res = await request(app).post('/api/wishes').send({ message: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

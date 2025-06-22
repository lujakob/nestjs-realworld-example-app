import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ApplicationModule } from '../src/app.module';
import { Connection } from 'typeorm';

describe('Acceptance Test: User Authentication Flow', () => {
  let app: INestApplication;
  let connection: Connection;

  const testUser = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'password123',
  };
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApplicationModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    connection = app.get(Connection);
  });

  afterAll(async () => {
    // Clean up the created user from the database
    const userRepository = connection.getRepository('UserEntity');
    await userRepository.delete({ email: testUser.email });
    await app.close();
  });

  it('1. (POST) /api/users - Should register a new user successfully', () => {
    return request(app.getHttpServer())
      .post('/api/users')
      .send({ user: testUser })
      .expect(201)
      .then((response) => {
        expect(response.body.user).toBeDefined();
        expect(response.body.user.email).toEqual(testUser.email);
        expect(response.body.user.username).toEqual(testUser.username);
        expect(response.body.user.token).toBeDefined();
      });
  });

  it('2. (POST) /api/users/login - Should log in the user and return a token', () => {
    return request(app.getHttpServer())
      .post('/api/users/login')
      .send({
        user: { email: testUser.email, password: testUser.password },
      })
      .expect(201)
      .then((response) => {
        expect(response.body.user.token).toBeDefined();
        authToken = response.body.user.token;
      });
  });

  it('3. (GET) /api/user - Should retrieve the authenticated user profile', () => {
    return request(app.getHttpServer())
      .get('/api/user')
      .set('Authorization', `Token ${authToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body.user).toBeDefined();
        expect(response.body.user.email).toEqual(testUser.email);
        expect(response.body.user.username).toEqual(testUser.username);
      });
  });
}); 
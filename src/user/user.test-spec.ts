import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ApplicationModule  } from '../app.module'; // Adjust the import path as necessary

describe('User', () => {
  let app: INestApplication;
    beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApplicationModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
  const user = {
      username: 'joaoteste',
      email: 'joao@email.com',
      password: '123456',
    };
    const userUpdate = {
      username: 'joaoteste_updated',
      email: 'joao@email.com',
      password: '123456',
    };
    let token: string;
    let userId: number;
    it('/users (POST)', () => {
        return request(app.getHttpServer())
        .post('/users')
        .send({ user })
        .expect(201)
        .expect((res) => {
            expect(res.body).toHaveProperty('user');
            expect(res.body.user).toHaveProperty('email', user.email);
            expect(res.body.user).toHaveProperty('username', user.username);
            expect(res.body.user).toHaveProperty('id');
            userId= res.body.user.id;
        });
    });
    it('/users/login (POST) with token', () => {
        return request(app.getHttpServer())
        .post('/users/login')
        .send({ user: { email: user.email, password: user.password } })
        .expect(201)
        .expect((res) => {
            expect(res.body).toHaveProperty('user');
            expect(res.body.user).toHaveProperty('email', user.email);
            expect(res.body.user).toHaveProperty('username', user.username);
            expect(res.body.user).toHaveProperty('token');
            token = res.body.user.token;
        });
    });
    it('/user (GET)', () => {
        return request(app.getHttpServer())
        .get('/user')
        .set('Authorization', `Token ${token}`)
        .expect(200)
        .expect((res) => {
            expect(res.body).toHaveProperty('user');
            expect(res.body.user).toHaveProperty('email');
            expect(res.body.user).toHaveProperty('username');
            expect(res.body.user).toHaveProperty('id', userId);
        });
    });
    it('/user (PUT)', () => {
        return request(app.getHttpServer())
        .put('/user')
        .set('Authorization', `Token ${token}`)
        .send({ user: userUpdate })
        .expect(200)
        .expect((res) => {
            expect(res.body).toHaveProperty('email', userUpdate.email);
            expect(res.body).toHaveProperty('username', userUpdate.username);
            expect(res.body).toHaveProperty('password', userUpdate.password);
            expect(res.body).toHaveProperty('bio');
            expect(res.body).toHaveProperty('id', userId);
            
        });
    });
    it('/user (GET) after update', () => {
        return request(app.getHttpServer())
        .get('/user')
        .set('Authorization', `Token ${token}`)
        .expect(200)
        .expect((res) => {
            expect(res.body).toHaveProperty('user');
            expect(res.body.user).toHaveProperty('email', userUpdate.email);
            expect(res.body.user).toHaveProperty('username', userUpdate.username);
            expect(res.body.user).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('id', userId);
        });
    });
    it('/users/:slug (DELETE)', () => {
        return request(app.getHttpServer())
        .delete('/users/' + user.email)
        .set('Authorization', `Token ${token}`)
        .expect(200)
        .expect((res) => {
            expect(res.body).toHaveProperty('affected', 1);
        });
    });
});
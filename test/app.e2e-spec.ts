import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Gender } from '../src/users/entities/user.entity';

describe('App (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;

  let accessToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);
    queryRunner = dataSource.createQueryRunner();

    const res1 = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'user1',
        password: 'password',
        gender: Gender.FEMALE,
      });
    expect(res1.status).toBe(201);
    accessToken = res1.body.access_token;

    const res2 = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'user2',
        password: 'password',
        gender: Gender.FEMALE,
      });
    expect(res2.status).toBe(201);
  });

  afterEach(async () => {
    await queryRunner.clearDatabase();
    await queryRunner.release();
    await app.close();
  });

  it('should register user on the platform', async () => {
    const res = await request(app.getHttpServer()).post('/auth/register').send({
      username: 'testuser',
      password: 'password',
      gender: Gender.FEMALE,
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('access_token');
  });

  it('should login with correct credentials', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({
      username: 'testuser',
      password: 'password',
      gender: Gender.FEMALE,
    });

    const res = await request(app.getHttpServer()).post('/auth/login').send({
      username: 'testuser',
      password: 'password',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('access_token');
  });

  it('should return 401 for incorrect credentials', async () => {
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      username: 'testuser',
      password: 'wrongpassword',
    });

    expect(res.status).toBe(401);
  });

  it('should return articles for guest user', async () => {
    const res = await request(app.getHttpServer())
      .get('/articles')
      .query({ page: 1, pageSize: 10 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
  });

  it('should return 401 status code when user is guest', async () => {
    const res = await request(app.getHttpServer()).post('/articles').send({
      title: 'New Article',
      body: 'This is a new article.',
    });

    expect(res.status).toBe(401);
  });

  it('should let logged-in user create an article', async () => {
    const res = await request(app.getHttpServer())
      .post('/articles')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New Article',
        body: 'This is a new article.',
      });

    expect(res.status).toBe(201);
  });

  it('should return to logged-in user 400 if body is missing', async () => {
    const res = await request(app.getHttpServer())
      .post('/articles')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New Article',
      });

    expect(res.status).toBe(400);
  });

  it('should allow user1 to follow user2', async () => {
    const res = await request(app.getHttpServer())
      .post(`/user/2/follow`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(201);
  });

  it('should allow user1 to unfollow user2', async () => {
    await request(app.getHttpServer())
      .post(`/user/2/follow`)
      .set('Authorization', `Bearer ${accessToken}`);

    const res = await request(app.getHttpServer())
      .delete(`/user/2/unfollow`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    await app.close();
  });
});

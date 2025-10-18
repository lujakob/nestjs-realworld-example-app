import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppModule } from "./../src/app.module";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "./../src/user/user.entity";
import { ArticleEntity } from "./../src/article/article.entity";
import { UserBlockEntity } from "./../src/user/user-block.entity";
import * as argon2 from "argon2";

describe("User Blocking (e2e)", () => {
  let app: INestApplication;
  let userRepository;
  let articleRepository;
  let userBlockRepository;

  const user1 = {
    username: "user1",
    email: "user1@example.com",
    password: "password123",
  };

  const user2 = {
    username: "user2",
    email: "user2@example.com",
    password: "password123",
  };

  let user1Token: string;
  let user2Token: string;
  let articleSlug: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get(getRepositoryToken(UserEntity));
    articleRepository = moduleFixture.get(getRepositoryToken(ArticleEntity));
    userBlockRepository = moduleFixture.get(
      getRepositoryToken(UserBlockEntity)
    );

    // Clear the database
    await userBlockRepository.delete({});
    await articleRepository.delete({});
    await userRepository.delete({});

    // Create test users
    const hashedPassword = await argon2.hash("password123");
    await userRepository.save([
      { ...user1, password: hashedPassword },
      { ...user2, password: hashedPassword },
    ]);

    // Get tokens
    const auth1Response = await request(app.getHttpServer())
      .post("/users/login")
      .send({ user: { email: user1.email, password: "password123" } });

    console.log("Auth1 response:", auth1Response.body);
    user1Token = auth1Response.body.user.token;

    const auth2 = await request(app.getHttpServer())
      .post("/users/login")
      .send({ user: { email: user2.email, password: "password123" } });
    user2Token = auth2.body.user.token;

    // Create a test article by user2
    const articleResponse = await request(app.getHttpServer())
      .post("/articles")
      .set("Authorization", "Token " + user2Token)
      .send({
        article: {
          title: "Test Article",
          description: "Test Description",
          body: "Test Body",
          tagList: ["test"],
        },
      });
    articleSlug = articleResponse.body.slug;
  });

  afterAll(async () => {
    await app.close();
  });

  it("should not allow blocking yourself", async () => {
    const response = await request(app.getHttpServer())
      .post(`/profiles/${user1.username}/block`)
      .set("Authorization", "Token " + user1Token)
      .expect(400);

    expect(response.body.message).toBe("Users cannot block themselves");
  });

  it("should not show articles from blocked user", async () => {
    // First verify that we can see the article
    const beforeBlock = await request(app.getHttpServer())
      .get("/articles")
      .set("Authorization", "Token " + user1Token);
    expect(beforeBlock.body.articles).toHaveLength(1);

    // Block user2
    await request(app.getHttpServer())
      .post(`/profiles/${user2.username}/block`)
      .set("Authorization", "Token " + user1Token)
      .expect(201);

    // Verify that the article is no longer visible
    const afterBlock = await request(app.getHttpServer())
      .get("/articles")
      .set("Authorization", "Token " + user1Token);
    expect(afterBlock.body.articles).toHaveLength(0);
  });
});

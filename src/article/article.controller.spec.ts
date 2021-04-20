import { Test, TestingModule } from "@nestjs/testing";
import { ArticleController } from "./article.controller";
import { ArticleService } from "./article.service";
import { UserService } from "../user/user.service";
import { UserController } from "../user/user.controller";
import { UserEntity } from "../user/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArticleEntity } from "./article.entity";
import { UserData, UserRO } from "../user/user.interface";
import { Comment } from "./comment.entity";
import { FollowsEntity } from "../profile/follows.entity";
import { ExecutionContext } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { SECRET } from "../config";

describe("ArticleController", () => {
  let articleController: ArticleController;
  let articleService: ArticleService;
  let userController: UserController;
  let userService: UserService;
  let user: UserEntity;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([
          ArticleEntity,
          Comment,
          UserEntity,
          FollowsEntity,
        ]),
      ],
      controllers: [ArticleController, UserController],
      providers: [ArticleService, UserService],
    }).compile();

    articleController = app.get<ArticleController>(ArticleController);
    userController = app.get<UserController>(UserController);
    articleService = app.get<ArticleService>(ArticleService);
    userService = app.get<UserService>(UserService);

    let timestamp = Date.now();
    let email = `test${timestamp}@test.io`;
    let password = "testPASS123";
    let username = `user${timestamp}`;

    let userRO = await userController.create({
      email,
      password,
      username,
    });

    userRO = await userController.login({
      email,
      password,
    });

    user = jwt.verify(userRO.user.token, SECRET);
  });

  describe("root", () => {
    it("should return article list", () => {
      expect(articleController.getFeed(user.id, null)).not.toBeNull();
    });
  });

  describe("root", () => {
    it("should create an article", async () => {
      await articleController.create(user.id, {
        title: "string",
        description: "string",
        body: "string",
        tagList: [],
      });

      let results = await articleController.findAll({ author: user.username });

      expect(results).not.toBeNull();
      expect(results.articlesCount).toEqual(1);
    });
  });
});

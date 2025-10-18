import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { CreateUserDto, LoginUserDto, UpdateUserDto } from "./dto";
const jwt = require("jsonwebtoken");
import { SECRET } from "../config";
import { UserRO } from "./user.interface";
import { validate } from "class-validator";
import { HttpException } from "@nestjs/common/exceptions/http.exception";
import { HttpStatus } from "@nestjs/common";
import * as argon2 from "argon2";

@Injectable()
export class UserService {
  private prisma: any;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne({ email, password }: LoginUserDto) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return null;
    }

    if (await argon2.verify(user.password, password)) {
      return user;
    }

    return null;
  }

  async create(dto: CreateUserDto): Promise<UserRO> {
    // check uniqueness of username/email
    const { username, email, password } = dto;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      const errors = { username: "Username and email must be unique." };
      throw new HttpException(
        { message: "Input data validation failed", errors },
        HttpStatus.BAD_REQUEST
      );
    }

    // create new user
    const hashedPassword = await argon2.hash(password);
    const savedUser = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        bio: "",
        image: "",
      },
    });

    return this.buildUserRO(savedUser);
  }

  async update(id: number, dto: UpdateUserDto) {
    const updated = await this.prisma.user.update({
      where: { id },
      data: dto,
    });
    return updated;
  }

  async delete(email: string) {
    return await this.prisma.user.delete({ where: { email } });
  }

  async findById(id: number): Promise<UserRO> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      const errors = { User: " not found" };
      throw new HttpException({ errors }, 401);
    }

    return this.buildUserRO(user);
  }

  async findByEmail(email: string): Promise<UserRO> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return this.buildUserRO(user);
  }

  public generateJWT(user) {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        exp: exp.getTime() / 1000,
      },
      SECRET
    );
  }

  private buildUserRO(user: any) {
    const userRO = {
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      token: this.generateJWT(user),
      image: user.image,
    };

    return { user: userRO };
  }
}

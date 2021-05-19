import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
// 用户信息实体
import { UserEntity } from './user.entity';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
const jwt = require('jsonwebtoken');
import { SECRET } from '../config';
import { UserRO } from './user.interface';
import { validate } from 'class-validator';
// HTTP异常类，用于向用户抛出HTTP异常
import { HttpException } from '@nestjs/common/exceptions/http.exception';
// HTTP状态
import { HttpStatus } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) { }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne({ email, password }: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ email });
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
    // 根据用户实体查询数据库，
    // 通过接口传过来的username字段进行匹配
    const qb = await getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .orWhere('user.email = :email', { email });

    const user = await qb.getOne();

    // 若数据控中已存在当前用户名和邮箱的用户数据 则在接口中进行提示
    if (user) {
      const errors = { username: 'Username and email must be unique.' };
      throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.BAD_REQUEST);

    }

    // create new user
    let newUser = new UserEntity();
    newUser.username = username;
    newUser.email = email;
    newUser.password = password;
    newUser.articles = [];

    // 通过校验库校验传入的数据是否符合要求（此处主要是用来校验email）
    const errors = await validate(newUser);
    if (errors.length > 0) {
      const _errors = { username: 'Userinput is not valid.' };
      // 创建HTTP错误实例  并抛出错误
      throw new HttpException({ message: '输入的数据有误', _errors }, HttpStatus.BAD_REQUEST);

    } else {
      const savedUser = await this.userRepository.save(newUser);
      return this.buildUserRO(savedUser);
    }

  }

  async update(id: number, dto: UpdateUserDto): Promise<UserEntity> {
    let toUpdate = await this.userRepository.findOne(id);
    delete toUpdate.password;
    delete toUpdate.favorites;

    let updated = Object.assign(toUpdate, dto);
    return await this.userRepository.save(updated);
  }

  async delete(email: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ email: email });
  }

  async findById(id: number): Promise<UserRO> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      const errors = { User: ' not found' };
      throw new HttpException({ errors }, 401);
    }

    return this.buildUserRO(user);
  }

  async findByEmail(email: string): Promise<UserRO> {
    const user = await this.userRepository.findOne({ email: email });
    return this.buildUserRO(user);
  }

  public generateJWT(user) {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
      id: user.id,
      username: user.username,
      email: user.email,
      exp: exp.getTime() / 1000,
    }, SECRET);
  };

  private buildUserRO(user: UserEntity) {
    const userRO = {
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      token: this.generateJWT(user),
      image: user.image
    };

    return { user: userRO };
  }
}

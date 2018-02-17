import { Component } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import {HttpException} from "@nestjs/core";
import {SECRET} from "../config";

@Component()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async verifyAuthentication({email}) {
    const user = await this.userService.findByEmail(email);
    return !!user;
  }

}
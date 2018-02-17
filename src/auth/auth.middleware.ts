import { HttpException } from '@nestjs/core';
import { Middleware, NestMiddleware } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { SECRET } from '../config';
import { AuthService } from './auth.service';

@Middleware()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  resolve(): (req: Request, res: Response, next: NextFunction) => void {

    return async (req: Request, res: Response, next: NextFunction) => {
      if (req.headers.authorization && (req.headers.authorization as string).split(' ')[0] === 'Token') {
        const token = (req.headers.authorization as string).split(' ')[1];
        const decoded: any = jwt.verify(token, SECRET);

        if (! await this.authService.verifyAuthentication(decoded)) {
          throw new HttpException('User not found.', 401);
        }
        next();
      } else {
        throw new HttpException('Not authorized.', 401);
      }
    };
  }
}
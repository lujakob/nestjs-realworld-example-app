import * as passport from 'passport';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {UserModule} from "../user/user.module";

@Module({
  imports: [UserModule],
  components: [AuthService]
})
export class AuthModule {}
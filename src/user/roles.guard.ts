import { Guard, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs/Observable';
import {AuthService} from "../auth/auth.service";

@Guard()
export class RolesGuard implements CanActivate {
  constructor() {

  }
  canActivate(dataOrRequest, context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log(dataOrRequest);
    // return this.authService.validateUser();
    return true;
  }
}
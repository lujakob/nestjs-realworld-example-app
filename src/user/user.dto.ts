export class CreateUserDto {
  readonly username: string;
  readonly email: string;
  readonly password: string;
}

export class LoginUserDto {
  readonly email: string;
  readonly password: string;
}
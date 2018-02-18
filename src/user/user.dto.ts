export class CreateUserDto {
  readonly username: string;
  readonly email: string;
  readonly password: string;
}

export class UpdateUserDto {
  readonly username: string;
  readonly email: string;
  readonly bio: string;
  readonly image: string;
}


export class LoginUserDto {
  readonly email: string;
  readonly password: string;
}
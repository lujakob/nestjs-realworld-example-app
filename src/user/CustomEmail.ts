import {ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from "class-validator";
import {UserService} from "./user.service";

@ValidatorConstraint({ name: "customText", async: true })
export class CustomEmail implements ValidatorConstraintInterface {

  constructor(private userService: UserService) {}

  async validate(text: string, args: ValidationArguments) {

    const user = await this.userService.findByEmail(text);
    return !user; // for async validations you must return a Promise<boolean> here
  }

  defaultMessage(args: ValidationArguments) { // here you can provide default error message if validation failed
    return "Text ($value) is too short or too long!";
  }

}
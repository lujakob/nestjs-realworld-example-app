import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { ValidationError, validate } from "class-validator";
import { plainToClass } from "class-transformer";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException("No data submitted");
    }

    const { metatype } = metadata;

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object, { whitelist: true });

    if (errors.length === 0) return value;

    const errMessages = errors.flatMap;
    (error: ValidationError) => {
      Object.values(error.constraints);
    };

    throw new BadRequestException(errMessages);
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}

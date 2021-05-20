/**
 * 管道是具有 @Injectable() 装饰器的类。管道应实现 PipeTransform 接口。
 * 
 * 管道有两个类型:
 * 转换：管道将输入数据转换为所需的数据输出
 * 验证：对输入数据进行验证，如果验证成功继续传递; 验证失败则抛出异常;
 * 在这两种情况下, 管道 参数(arguments) 会由 控制器(controllers)的路由处理程序 进行处理. 
 * Nest 会在调用这个方法之前插入一个管道，管道会先拦截方法的调用参数,进行转换或是验证处理，然后用转换好或是验证好的参数调用原方法。
 * 
 * 验证管道验证成功会返回请求参数给控制器，验证失败则抛出异常
 */
import {PipeTransform, ArgumentMetadata, BadRequestException, HttpStatus, Injectable} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  /**
   * 
   * @param value 接口参数
   * @param metadata 元类型
   * @returns 
   */
  async transform(value, metadata: ArgumentMetadata) {

    if (!value) {
      throw new BadRequestException('No data submitted');
    }

    const { metatype } = metadata;
    // metatype为属性的元类型，例如 String。 如果在函数签名中省略类型声明，或者使用原生 JavaScript，则为 undefined
    // 当metatype存在时，说明不是Javascript类型验证，则跳过此步
    // 若metatype为undefined 则进行类型验证，若验证成功则直接返回参数value
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    //使用 class-transformer 的 plainToClass() 方法来转换 JavaScript 的参数为可验证的类型对象。
    // 将接口JSON value 以metatype 转换为 CreateUserDto 的class
    const object = plainToClass(metatype, value);
    // 对参数进行验证，若验证失败则抛出HTTP错误
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new HttpException({message: 'Input data validation failed', errors:  this.buildError(errors)}, HttpStatus.BAD_REQUEST);
    }
    return value;
  }

  private buildError(errors) {
    const result = {};
    errors.forEach(el => {
      let prop = el.property;
      Object.entries(el.constraints).forEach(constraint => {
        result[prop + constraint[0]] = `${constraint[1]}`;
      });
    });
    return result;
  }

  /**
   * 验证是否为javascript类型
   * @param metatype 
   * @returns 
   */
  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => {
      // console.log(type ===  metatype)
      return metatype === type
    });
  }
}

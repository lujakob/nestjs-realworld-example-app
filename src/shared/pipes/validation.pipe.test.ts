import { ValidationPipe } from './validation.pipe';
import { ArgumentMetadata, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

// src/shared/pipes/validation.pipe.test.ts

jest.mock('class-validator');
jest.mock('class-transformer');

class TestDto {
  prop: string;
}

describe('ValidationPipe', () => {
  let pipe: ValidationPipe;

  beforeEach(() => {
    pipe = new ValidationPipe();
    (plainToClass as jest.Mock).mockImplementation((_cls, val) => val);
  });

  it('should throw BadRequestException if value is null', async () => {
    await expect(pipe.transform(null, {} as ArgumentMetadata))
      .rejects
      .toThrow(BadRequestException);
  });

  it('should return value if no metatype', async () => {
    const value = { test: 1 };
    const meta: ArgumentMetadata = { type: 'body', metatype: undefined, data: '' };
    const result = await pipe.transform(value, meta);
    expect(result).toBe(value);
  });

  it('should return value if metatype does not need validation', async () => {
    const value = 'string';
    const meta: ArgumentMetadata = { type: 'body', metatype: String, data: '' };
    const result = await pipe.transform(value, meta);
    expect(result).toBe(value);
  });

  it('should throw HttpException if validation fails', async () => {
    (validate as jest.Mock).mockResolvedValue([
      {
        property: 'prop',
        constraints: { isString: 'prop must be a string' }
      }
    ]);
    const value = { prop: 123 };
    const meta: ArgumentMetadata = { type: 'body', metatype: TestDto, data: '' };
    await expect(pipe.transform(value, meta))
      .rejects
      .toThrow(HttpException);
    try {
      await pipe.transform(value, meta);
    } catch (e) {
      expect(e.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(e.getResponse()).toHaveProperty('message', 'Input data validation failed');
      expect(e.getResponse()).toHaveProperty('errors');
    }
  });

  it('should return value if validation passes', async () => {
    (validate as jest.Mock).mockResolvedValue([]);
    const value = { prop: 'ok' };
    const meta: ArgumentMetadata = { type: 'body', metatype: TestDto, data: '' };
    const result = await pipe.transform(value, meta);
    expect(result).toBe(value);
  });
});
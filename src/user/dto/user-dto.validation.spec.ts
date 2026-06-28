import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { LoginUserDto } from './login-user.dto';

/**
 * Security-focused tests for the input-validation hardening.
 *
 * These exercise the exact ValidationPipe configuration registered globally
 * in main.ts (whitelist + forbidNonWhitelisted + transform) against the user
 * DTOs, proving:
 *   1. malformed input is rejected with HTTP 400,
 *   2. unexpected properties are rejected (mass-assignment defence),
 *   3. valid input passes through unchanged.
 *
 * They run without a database or TypeORM connection, so they are
 * deterministic and fast on any Node version supported by the project.
 */
describe('User DTO validation (security hardening)', () => {
  // Mirror the global pipe configured in src/main.ts.
  const pipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });

  const meta = (metatype): ArgumentMetadata => ({
    type: 'body',
    metatype,
    data: '',
  });

  const expect400 = async (metatype, payload) => {
    let status: number | undefined;
    try {
      await pipe.transform(payload, meta(metatype));
    } catch (err) {
      status = err.getStatus ? err.getStatus() : undefined;
    }
    expect(status).toBe(400);
  };

  describe('CreateUserDto', () => {
    const valid = {
      username: 'madhukar',
      email: 'madhukar@example.com',
      password: 'Str0ngPass!',
    };

    it('accepts a well-formed registration payload', async () => {
      const result = await pipe.transform({ ...valid }, meta(CreateUserDto));
      expect(result).toEqual(valid);
    });

    it('rejects a malformed email', async () => {
      await expect400(CreateUserDto, { ...valid, email: 'not-an-email' });
    });

    it('rejects a too-short (weak) password', async () => {
      await expect400(CreateUserDto, { ...valid, password: 'short' });
    });

    it('rejects a missing required field', async () => {
      const { password, ...withoutPassword } = valid;
      await expect400(CreateUserDto, withoutPassword);
    });

    it('rejects unexpected properties (mass-assignment defence)', async () => {
      await expect400(CreateUserDto, { ...valid, isAdmin: true, id: 999 });
    });
  });

  describe('UpdateUserDto (previously unvalidated PUT /user path)', () => {
    it('accepts a partial, valid update', async () => {
      const payload = { bio: 'Senior Solution Architect' };
      const result = await pipe.transform(payload, meta(UpdateUserDto));
      expect(result).toEqual(payload);
    });

    it('rejects an injected privileged field (mass-assignment defence)', async () => {
      await expect400(UpdateUserDto, { bio: 'hi', isAdmin: true });
    });

    it('rejects a malformed email on update', async () => {
      await expect400(UpdateUserDto, { email: 'bad' });
    });
  });

  describe('LoginUserDto', () => {
    it('rejects a malformed email on login', async () => {
      await expect400(LoginUserDto, { email: 'bad', password: 'whatever' });
    });

    it('rejects unexpected properties on login', async () => {
      await expect400(LoginUserDto, {
        email: 'a@b.com',
        password: 'x',
        role: 'admin',
      });
    });
  });
});

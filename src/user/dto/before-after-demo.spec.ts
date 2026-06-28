import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { UpdateUserDto } from './update-user.dto';

// Demonstrates the BEFORE behaviour: the original code had NO global pipe and
// an UpdateUserDto with NO decorators -> a non-whitelisting pipe lets the
// malicious 'isAdmin' field through (mass assignment).
describe('Before/after contrast: mass-assignment on PUT /user', () => {
  const meta = (metatype): ArgumentMetadata => ({ type: 'body', metatype, data: '' });
  const malicious = { bio: 'hi', isAdmin: true, password: 'pwned' };

  it('BEFORE (non-whitelisting pipe): malicious fields pass through', async () => {
    const permissive = new ValidationPipe({ transform: true }); // no whitelist
    const out: any = await permissive.transform(malicious, meta(UpdateUserDto));
    expect(out.isAdmin).toBe(true);
    expect(out.password).toBe('pwned');
  });

  it('AFTER (hardened pipe): malicious fields are rejected with 400', async () => {
    const hardened = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true });
    let status: number | undefined;
    try { await hardened.transform(malicious, meta(UpdateUserDto)); }
    catch (e) { status = e.getStatus(); }
    expect(status).toBe(400);
  });
});

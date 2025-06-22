import { AuthMiddleware } from './auth.middleware';
import { UserService } from './user.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware;
  let userService: { findById: jest.Mock };

  const mockUser = { user: { id: 1, username: 'john' } };

  beforeEach(() => {
    userService = { findById: jest.fn() };
    middleware = new AuthMiddleware(userService as any);
  });

  it('should call next if user is authenticated', async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ id: 1 });
    userService.findById.mockResolvedValue(mockUser);

    const req: any = { headers: { authorization: 'Bearer faketoken' } };
    const res: any = {};
    const next = jest.fn();

    await middleware.use(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('faketoken', expect.anything());
    expect(userService.findById).toHaveBeenCalledWith(1);
    expect(req.user).toEqual(mockUser.user);
    expect(next).toHaveBeenCalled();
  });

  it('should throw if no authorization header', async () => {
    const req: any = { headers: {} };
    const res: any = {};
    const next = jest.fn();

    await expect(middleware.use(req, res, next)).rejects.toThrow(HttpException);
    await expect(middleware.use(req, res, next)).rejects.toThrow('Not authorized.');
  });

  it('should throw if user not found', async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ id: 2 });
    userService.findById.mockResolvedValue(null);

    const req: any = { headers: { authorization: 'Bearer faketoken' } };
    const res: any = {};
    const next = jest.fn();

    await expect(middleware.use(req, res, next)).rejects.toThrow(HttpException);
    await expect(middleware.use(req, res, next)).rejects.toThrow('User not found.');
  });
});
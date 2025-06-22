import { BaseController } from './base.controller';
import * as jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('BaseController', () => {
  let controller: BaseController;

  beforeEach(() => {
    controller = new BaseController();
  });

  it('should return null if no authorization header is provided', () => {
    expect(controller['getUserIdFromToken'](null)).toBeNull();
    expect(controller['getUserIdFromToken'](undefined)).toBeNull();
  });

  it('should return user id if token is valid', () => {
    (jwt.verify as jest.Mock).mockReturnValue({ id: 123 });
    const fakeAuth = 'Bearer faketoken';
    const result = controller['getUserIdFromToken'](fakeAuth);
    expect(jwt.verify).toHaveBeenCalledWith('faketoken', expect.anything());
    expect(result).toEqual(123);
  });
});
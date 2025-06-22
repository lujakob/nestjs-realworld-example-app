import { FollowsEntity } from './follows.entity';

describe('FollowsEntity', () => {
  it('should create an instance with default values', () => {
    const follows = new FollowsEntity();
    expect(follows.id).toBeUndefined();
    expect(follows.followerId).toBeUndefined();
    expect(follows.followingId).toBeUndefined();
  });

  it('should allow setting and getting properties', () => {
    const follows = new FollowsEntity();
    follows.id = 1;
    follows.followerId = 2;
    follows.followingId = 3;

    expect(follows.id).toBe(1);
    expect(follows.followerId).toBe(2);
    expect(follows.followingId).toBe(3);
  });
});
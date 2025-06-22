import { TagEntity } from './tag.entity';

describe('TagEntity', () => {
  it('should create an instance with default values', () => {
    const tag = new TagEntity();
    expect(tag.id).toBeUndefined();
    expect(tag.tag).toBeUndefined();
  });

  it('should allow setting and getting properties', () => {
    const tag = new TagEntity();
    tag.id = 1;
    tag.tag = 'nestjs';

    expect(tag.id).toBe(1);
    expect(tag.tag).toBe('nestjs');
  });
});
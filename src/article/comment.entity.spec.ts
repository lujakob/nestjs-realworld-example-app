import { Comment } from './comment.entity';
import { ArticleEntity } from './article.entity';

describe('Comment', () => {
  it('should create an instance with default values', () => {
    const comment = new Comment();
    expect(comment.id).toBeUndefined();
    expect(comment.body).toBeUndefined();
    expect(comment.article).toBeUndefined();
  });

  it('should allow setting and getting properties', () => {
    const comment = new Comment();
    comment.id = 1;
    comment.body = 'Test comment';
    const article = new ArticleEntity();
    article.id = 2;
    comment.article = article;

    expect(comment.id).toBe(1);
    expect(comment.body).toBe('Test comment');
    expect(comment.article.id).toBe(2);
  });
});
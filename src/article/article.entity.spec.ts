import { ArticleEntity } from './article.entity';
import { UserEntity } from '../user/user.entity';
import { Comment } from './comment.entity';

describe('ArticleEntity', () => {
  it('should update the updated field when updateTimestamp is called', () => {
    const article = new ArticleEntity();
    const before = article.updated;
    article.updateTimestamp();
    expect(article.updated).not.toBe(before);
    expect(article.updated).toBeInstanceOf(Date);
  });

  it('should allow setting and getting properties', () => {
    const article = new ArticleEntity();
    article.title = 'Title';
    article.slug = 'slug-test';
    article.description = 'desc';
    article.body = 'body';
    article.tagList = ['nestjs', 'test'];
    article.favoriteCount = 5;

    expect(article.title).toBe('Title');
    expect(article.slug).toBe('slug-test');
    expect(article.description).toBe('desc');
    expect(article.body).toBe('body');
    expect(article.tagList).toEqual(['nestjs', 'test']);
    expect(article.favoriteCount).toBe(5);
  });

  it('should allow associating author and comments', () => {
    const article = new ArticleEntity();
    const user = new UserEntity();
    user.id = 1;
    article.author = user;

    const comment = new Comment();
    comment.id = 1;
    article.comments = [comment];

    expect(article.author.id).toBe(1);
    expect(article.comments[0].id).toBe(1);
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { CreateArticleDto, CreateCommentDto } from './dto';
import { ArticleEntity } from './article.entity';
import { Comment } from './comment.entity';
import { UserEntity } from '../user/user.entity';
import { FollowsEntity } from '../profile/follows.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ArticleService', () => {
  let service: ArticleService;
  let articleRepository: any;
  let commentRepository: any;
  let userRepository: any;
  let followsRepository: any;

  beforeEach(async () => {
    articleRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      find: jest.fn(),
    };
    commentRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };
    userRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };
    followsRepository = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        { provide: getRepositoryToken(ArticleEntity), useValue: articleRepository },
        { provide: getRepositoryToken(Comment), useValue: commentRepository },
        { provide: getRepositoryToken(UserEntity), useValue: userRepository },
        { provide: getRepositoryToken(FollowsEntity), useValue: followsRepository },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return an article by slug', async () => {
      const article = { slug: 'test-article' };
      articleRepository.findOne.mockResolvedValue(article);
      const result = await service.findOne({ slug: 'test-article' });
      expect(result.article.slug).toBe('test-article');
    });
  });

  describe('addComment', () => {
    it('should add a comment to an article', async () => {
      const article = { slug: 'test-article', comments: [] };
      articleRepository.findOne.mockResolvedValue(article);
      commentRepository.save.mockResolvedValue({ id: 1, body: 'Nice!' });
      articleRepository.save.mockResolvedValue({
        ...article,
        comments: [{ id: 1, body: 'Nice!' }],
      });
      const dto: CreateCommentDto = { body: 'Nice!' };
      const result = await service.addComment('test-article', dto);
      expect(result.article.comments[0].body).toBe('Nice!');
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment from an article', async () => {
      const article = { slug: 'test-article', comments: [{ id: 1, body: 'Nice!' }] };
      articleRepository.findOne.mockResolvedValue(article);
      commentRepository.findOne.mockResolvedValue({ id: 1, body: 'Nice!' });
      commentRepository.delete.mockResolvedValue({});
      articleRepository.save.mockResolvedValue({ ...article, comments: [] });
      const result = await service.deleteComment('test-article', '1');
      expect(result.article.comments).toHaveLength(0);
    });
    it('should return article if comment not found', async () => {
      const article = { slug: 'test-article', comments: [{ id: 1, body: 'Nice!' }] };
      articleRepository.findOne.mockResolvedValue(article);
      commentRepository.findOne.mockResolvedValue({ id: 2, body: 'Other' });
      const result = await service.deleteComment('test-article', '2');
      expect(result.article.comments).toHaveLength(1);
    });
  });

  describe('favorite', () => {
    it('should favorite an article', async () => {
      const article = { id: 1, slug: 'test-article', favoriteCount: 0 };
      const user = { id: 1, favorites: [] };
      articleRepository.findOne.mockResolvedValue(article);
      userRepository.findOne.mockResolvedValue(user);
      userRepository.save.mockResolvedValue({ ...user, favorites: [article] });
      articleRepository.save.mockResolvedValue({ ...article, favoriteCount: 1 });
      const result = await service.favorite(1, 'test-article');
      expect(result.article.favoriteCount).toBe(1);
    });
    it('should not favorite if already favorited', async () => {
      const article = { id: 1, slug: 'test-article', favoriteCount: 1 };
      const user = { id: 1, favorites: [article] };
      articleRepository.findOne.mockResolvedValue(article);
      userRepository.findOne.mockResolvedValue(user);
      const result = await service.favorite(1, 'test-article');
      expect(result.article.favoriteCount).toBe(1);
    });
  });

  describe('unFavorite', () => {
    it('should unfavorite an article', async () => {
      const article = { id: 1, slug: 'test-article', favoriteCount: 1 };
      const user = { id: 1, favorites: [article] };
      articleRepository.findOne.mockResolvedValue(article);
      userRepository.findOne.mockResolvedValue(user);
      userRepository.save.mockResolvedValue({ ...user, favorites: [] });
      articleRepository.save.mockResolvedValue({ ...article, favoriteCount: 0 });
      const result = await service.unFavorite(1, 'test-article');
      expect(result.article.favoriteCount).toBe(0);
    });
    it('should not unfavorite if not favorited', async () => {
      const article = { id: 1, slug: 'test-article', favoriteCount: 0 };
      const user = { id: 1, favorites: [] };
      articleRepository.findOne.mockResolvedValue(article);
      userRepository.findOne.mockResolvedValue(user);
      const result = await service.unFavorite(1, 'test-article');
      expect(result.article.favoriteCount).toBe(0);
    });
  });

  describe('findComments', () => {
    it('should return comments of an article', async () => {
      const article = { slug: 'test-article', comments: [{ id: 1, body: 'Nice article!' }] };
      articleRepository.findOne.mockResolvedValue(article);
      const result = await service.findComments('test-article');
      expect(result.comments).toHaveLength(1);
      expect(result.comments[0].body).toBe('Nice article!');
    });
  });

  describe('create', () => {
    it('should create and return an article', async () => {
      const dto: CreateArticleDto = {
        title: 'Test',
        description: 'Description',
        body: 'Body',
        tagList: ['nestjs', 'testing'],
      };
      const article = {
        ...dto,
        slug: 'test-article',
        comments: [],
      };
      articleRepository.save.mockResolvedValue(article);
      userRepository.findOne.mockResolvedValue({ id: 1, articles: [] });
      userRepository.save.mockResolvedValue({});
      const result = await service.create(1, dto);
      expect(result.title).toBe('Test');
    });
  });

  describe('update', () => {
    it('should update and return an article', async () => {
      const dto: CreateArticleDto = {
        title: 'Updated',
        description: 'Updated Description',
        body: 'Updated Body',
        tagList: ['updated'],
      };
      const article = { slug: 'test-article', ...dto };
      articleRepository.findOne.mockResolvedValue(article);
      articleRepository.save.mockResolvedValue(article);
      const result = await service.update('test-article', dto);
      expect(result.article.title).toBe('Updated');
    });
  });

  describe('delete', () => {
    it('should delete an article', async () => {
      articleRepository.delete.mockResolvedValue({ affected: 1 });
      const result = await service.delete('test-article');
      expect(result.affected).toBe(1);
    });
  });

  describe('slugify', () => {
    it('should generate a slug', () => {
      const slug = service.slugify('My Article');
      expect(slug).toMatch(/^my-article-/);
    });
  });
});

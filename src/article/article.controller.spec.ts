import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { CreateArticleDto, CreateCommentDto } from './dto';

describe('ArticleController', () => {
  let controller: ArticleController;
  let service: ArticleService;

  const mockArticleService = {
    findAll: jest.fn(),
    findFeed: jest.fn(),
    findOne: jest.fn(),
    findComments: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    addComment: jest.fn(),
    deleteComment: jest.fn(),
    favorite: jest.fn(),
    unFavorite: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [
        { provide: ArticleService, useValue: mockArticleService },
      ],
    }).compile();

    controller = module.get<ArticleController>(ArticleController);
    service = module.get<ArticleService>(ArticleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all articles', async () => {
    const result = { articles: [], articlesCount: 0 };
    mockArticleService.findAll.mockResolvedValue(result);
    expect(await controller.findAll({})).toBe(result);
  });

  it('should get article feed', async () => {
    const result = { articles: [], articlesCount: 0 };
    mockArticleService.findFeed.mockResolvedValue(result);
    expect(await controller.getFeed(1, {})).toBe(result);
  });

  it('should get one article', async () => {
    const result = { article: { slug: 'slug' } };
    mockArticleService.findOne.mockResolvedValue(result);
    expect(await controller.findOne('slug')).toBe(result);
  });

  it('should get comments for an article', async () => {
    const result = { comments: [] };
    mockArticleService.findComments.mockResolvedValue(result);
    expect(await controller.findComments('slug')).toBe(result);
  });

  it('should create an article', async () => {
    const dto: CreateArticleDto = { title: 't', description: 'd', body: 'b', tagList: [] };
    const result = { article: { slug: 'slug' } };
    mockArticleService.create.mockResolvedValue(result);
    expect(await controller.create(1, dto)).toBe(result);
  });

  it('should update an article', async () => {
    const dto: CreateArticleDto = { title: 't', description: 'd', body: 'b', tagList: [] };
    const result = { article: { slug: 'slug' } };
    mockArticleService.update.mockResolvedValue(result);
    expect(await controller.update({ slug: 'slug' }, dto)).toBe(result);
  });

  it('should delete an article', async () => {
    const result = { affected: 1 };
    mockArticleService.delete.mockResolvedValue(result);
    expect(await controller.delete({ slug: 'slug' })).toBe(result);
  });

  it('should create a comment', async () => {
    const dto: CreateCommentDto = { body: 'comment' };
    const result = { comment: { id: 1, body: 'comment' } };
    mockArticleService.addComment.mockResolvedValue(result);
    expect(await controller.createComment('slug', dto)).toBe(result);
  });

  it('should delete a comment', async () => {
    const result = { success: true };
    mockArticleService.deleteComment.mockResolvedValue(result);
    expect(await controller.deleteComment({ slug: 'slug', id: '1' })).toBe(result);
  });

  it('should favorite an article', async () => {
    const result = { article: { slug: 'slug', favorited: true } };
    mockArticleService.favorite.mockResolvedValue(result);
    expect(await controller.favorite(1, 'slug')).toBe(result);
  });

  it('should unfavorite an article', async () => {
    const result = { article: { slug: 'slug', favorited: false } };
    mockArticleService.unFavorite.mockResolvedValue(result);
    expect(await controller.unFavorite(1, 'slug')).toBe(result);
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TagEntity } from './tag.entity';

describe('TagController', () => {
  let controller: TagController;
  let service: TagService;

  const mockTagService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [
        { provide: TagService, useValue: mockTagService },
      ],
    }).compile();

    controller = module.get<TagController>(TagController);
    service = module.get<TagService>(TagService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all tags', async () => {
    const tags: TagEntity[] = [
      { id: 1, tag: 'nestjs' },
      { id: 2, tag: 'testing' },
    ];
    mockTagService.findAll.mockResolvedValue(tags);
    const result = await controller.findAll();
    expect(result).toBe(tags);
    expect(service.findAll).toHaveBeenCalled();
  });
});
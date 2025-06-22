import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from './tag.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TagEntity } from './tag.entity';
import { Repository } from 'typeorm';

describe('TagService', () => {
  let service: TagService;
  let repository: Repository<TagEntity>;

  const mockTagRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        { provide: getRepositoryToken(TagEntity), useValue: mockTagRepository },
      ],
    }).compile();

    service = module.get<TagService>(TagService);
    repository = module.get<Repository<TagEntity>>(getRepositoryToken(TagEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all tags', async () => {
    const tags: TagEntity[] = [
      { id: 1, tag: 'nestjs' },
      { id: 2, tag: 'testing' },
    ];
    mockTagRepository.find.mockResolvedValue(tags);
    const result = await service.findAll();
    expect(result).toBe(tags);
    expect(mockTagRepository.find).toHaveBeenCalled();
  });
});
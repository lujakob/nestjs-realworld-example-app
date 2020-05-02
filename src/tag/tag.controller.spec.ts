import { Test } from '@nestjs/testing';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { UserModule } from '../user/user.module';
import { PrismaService } from '../shared/services/prisma.service';

describe('TagController', () => {
  let tagController: TagController;
  let tagService: TagService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [UserModule],
      controllers: [TagController],
      providers: [TagService, PrismaService],
    }).compile();

    tagService = module.get<TagService>(TagService);
    tagController = module.get<TagController>(TagController);
  });

  describe('findAll', () => {
    it('should return an array of tags', async () => {
      const tags : any[] = [];
      const createTag = (name) => {
        return name;
      };
      tags.push(createTag('angularjs'));
      tags.push(createTag('reactjs'));

      jest.spyOn(tagService, 'findAll').mockImplementation(() => Promise.resolve(tags));
      
      const findAllResult = await tagController.findAll();
      expect(findAllResult).toBe(tags);
    });
  });
});
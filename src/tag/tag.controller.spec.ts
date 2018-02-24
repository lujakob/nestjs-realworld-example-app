import { Test } from '@nestjs/testing';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TagEntity} from "./tag.entity";

describe('TagController', () => {
  let tagController: TagController;
  let tagService: TagService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([TagEntity])],
      controllers: [TagController],
      components: [TagService],
    }).compile();

    tagService = module.get<TagService>(TagService);
    tagController = module.get<TagController>(TagController);
  });

  describe('findAll', () => {
    it('should return an array of tags', async () => {
      const result = ['angularjs', 'reactjs'];
      jest.spyOn(tagService, 'findAll').mockImplementation(() => result);

      expect(await tagController.findAll()).toBe(result);
    });
  });
});
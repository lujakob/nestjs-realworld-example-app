import { Test } from "@nestjs/testing";
import { TagController } from "./tag.controller";
import { TagService } from "./tag.service";

describe("TagController", () => {
  let tagController: TagController;
  let tagService: TagService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [TagController],
      providers: [TagService],
    }).compile();

    tagService = module.get<TagService>(TagService);
    tagController = module.get<TagController>(TagController);
  });

  describe("findAll", () => {
    it("should return an array of tags", async () => {
      const tags = [{ tag: "angularjs" }, { tag: "reactjs" }];

      jest
        .spyOn(tagService, "findAll")
        .mockImplementation(() => Promise.resolve(tags));

      const findAllResult = await tagController.findAll();
      expect(findAllResult).toBe(tags);
    });
  });
});

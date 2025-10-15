import { Get, Controller } from "@nestjs/common";

import { TagService } from "./tag.service";

import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags("tags")
@Controller("tags")
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async findAll() {
    return await this.tagService.findAll();
  }
}

import { Get, Controller } from "@nestjs/common";

import { TagService } from "./tag.service";

import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiOperation,
} from "@nestjs/swagger";
import { TagsRO, CreateTagDto } from "./tag.dto";

@ApiBearerAuth()
@ApiTags("tags")
@Controller("tags")
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOperation({
    summary: "Get All Tags",
    operationId: "GetTags",
  })
  @ApiResponse({
    type: TagsRO,
  })
  async findAll(): Promise<TagsRO> {
    const _tags = await this.tagService.findAll();
    const tags: CreateTagDto[] = [];
    for (let i = 0; i < _tags.length; i++) {
      const tag: CreateTagDto = {
        tag: _tags[i].tag,
      };
      tags.push(tag);
    }

    const returns: TagsRO = {
      tags,
    };
    return returns;
  }
}

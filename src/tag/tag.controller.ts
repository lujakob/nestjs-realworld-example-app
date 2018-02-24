import {Get, Post, Delete, Param, Controller, Headers} from '@nestjs/common';

import { TagEntity } from './tag.entity';
import { TagService } from './tag.service';


@Controller()
export class TagController {

  constructor(private readonly tagService: TagService) {}

  @Get('tags')
  async getTags(@Param('username') username: string): Promise<TagEntity[]> {
    return await this.tagService.findAll();
  }

}
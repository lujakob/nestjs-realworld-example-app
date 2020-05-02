import {Get, Controller } from '@nestjs/common';
import { TagService } from './tag.service';

import {
  ApiBearerAuth, ApiOperation, ApiResponse, ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({ status: 200, description: 'Return all tags.'})
  @Get()
  async findAll(): Promise<any[]> {
    return await this.tagService.findAll();
  }

}
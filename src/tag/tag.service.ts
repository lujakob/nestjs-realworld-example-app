import { Injectable} from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import { Tag } from '@prisma/client';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<any> {
    const res = await this.prisma.tag.findMany();
    const tags = res.map((t: Tag) => t.name);
    return { tags };
  }
}

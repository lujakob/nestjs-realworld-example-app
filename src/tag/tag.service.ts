import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class TagService {
  private prisma: any;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll() {
    // Отримуємо всі унікальні теги з статей
    const articles = await this.prisma.article.findMany({
      select: {
        tagList: true,
      },
    });

    const allTags = articles.flatMap((article) => {
      try {
        return JSON.parse(article.tagList);
      } catch {
        return [];
      }
    });

    const uniqueTags = [...new Set(allTags)];
    return uniqueTags.map((tag) => ({ tag }));
  }
}

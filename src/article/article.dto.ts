export class CreateArticleDto {
  readonly title: string;
  readonly description: string;
  readonly body: string;
  readonly tagList: string[];
}

export class CreateCommentDto {
  readonly body: string;
}
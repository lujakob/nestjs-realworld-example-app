import * as Faker from '@faker-js/faker';
import { define } from 'typeorm-seeding';

import { ArticleEntity } from '../../article/article.entity';

define(ArticleEntity, (faker: typeof Faker) => {
  const article = new ArticleEntity();
  article.slug = faker.lorem.slug();
  article.title = faker.name.title();
  article.description = faker.lorem.text(10);
  var tags = [];
  for (var i=0; i<faker.random.number({min:1, max:9}); i++) {
    tags.push(faker.lorem.word())
  }
  article.tagList = tags
  return article;
});

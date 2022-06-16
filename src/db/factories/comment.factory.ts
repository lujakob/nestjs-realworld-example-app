import * as Faker from '@faker-js/faker';
import { define } from 'typeorm-seeding';

import { Comment } from '../../article/comment.entity';

define(Comment, (faker: typeof Faker) => {
  const comment = new Comment();
  comment.body = faker.lorem.words(8);
  return comment;
});

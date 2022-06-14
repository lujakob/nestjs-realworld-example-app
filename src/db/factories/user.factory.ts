import * as Faker from '@faker-js/faker';
import { define } from 'typeorm-seeding';

import { UserEntity } from '../../user/user.entity';

define(UserEntity, (faker: typeof Faker) => {
  const user = new UserEntity();
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  user.username = faker.internet.userName(`${firstName} ${lastName}`);
  user.email = faker.internet.email(`${firstName} ${lastName}`);
  user.password = faker.internet.password();
  return user;
});

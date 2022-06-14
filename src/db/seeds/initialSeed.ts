import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { UserEntity } from '../../user/user.entity';
import { Comment } from '../../article/comment.entity';
import { ArticleEntity } from '../../article/article.entity';


export default class InitialDatabaseSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {

    const users = await factory(UserEntity)().createMany(15);

    const articles = await factory(ArticleEntity)()
      .map(async (article) => {
        article.author = users[Math.floor(Math.random() * users.length)];
        return article;
      })
      .createMany(10);

//     await factory(Comment)().createMany(15);

  }
}
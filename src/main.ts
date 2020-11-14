import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as compression from 'compression';


async function bootstrap() {
  const appOptions = { cors: true };
  const app = await NestFactory.create(ApplicationModule, appOptions);
  app.setGlobalPrefix('api');
  // somewhere in your initialization file
  app.use(compression());

  const options = new DocumentBuilder()
    .setTitle('NestJS Realworld Example App')
    .setDescription('The Realworld API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
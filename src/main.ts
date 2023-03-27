import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // * 제네릭으로 <NestExpressApplication>을 추가해줘야 app이 확실하게  ExpressApp이 된다. 그래야 ExpressApp을 통해 static 파일들을 제공할 수 있다.
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(
    ['/docs', '/docs-json'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );

  // http://localhost:8000/media/cats/aaa.png 와 같은 경로로 serving 받을 수 있게 된다.
  app.useStaticAssets(path.join(__dirname, './common', 'uploads'), {
    prefix: '/media',
  });

  const config = new DocumentBuilder()
    .setTitle('The cats API Document')
    .setDescription('The cats API 입니다.')
    .setVersion('1.0.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // * 스웨거 API에 'api'로 엔드포인트 지정 -> localhost:8000/doc
  app.enableCors({
    origin: true, // * origin:true는 모두 허용이므로 배포 시에는 특정 URL로 지정해줘야한다.
    credentials: true, // * 프론트에서도 withCredential: true 처리가 필요하다.
  });
  await app.listen(process.env.PORT);
}
bootstrap();

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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

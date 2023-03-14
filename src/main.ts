import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true, // * origin:true는 모두 허용이므로 배포 시에는 특정 URL로 지정해줘야한다.
    credentials: true, // * 프론트에서도 withCredential: true 처리가 필요하다.
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  //* Swagger bootstrap
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
      .setTitle('The cats API Document')
      .setDescription('The cats API 입니다.')
      .setVersion('1.0.0')
      .addTag('cats')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document); // * 스웨거 API에 'api'로 엔드포인트 지정 -> localhost:3000/api

    await app.listen(3000);
  }
  bootstrap();
  //

  await app.listen(process.env.PORT);
}
bootstrap();

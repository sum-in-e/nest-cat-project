import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from 'src/auth/auth.module';
import { CatsRepository } from 'src/cats/cats.repository';
import { Cat, CatSchema } from 'src/cats/cats.schema';
import { CatsController } from 'src/cats/controllers/cats.controller';
import { CatsService } from 'src/cats/services/cats.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './upload', // * 파일을 저장할 디렉토리 설정
    }),
    CatsModule,
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]),
    forwardRef(() => AuthModule),
    HttpModule,
  ],
  controllers: [CatsController],
  providers: [CatsService, CatsRepository],
  exports: [CatsService, CatsRepository],
})
export class CatsModule {}

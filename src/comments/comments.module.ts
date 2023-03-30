import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from 'src/cats/cats.schema';
import { CommentsController } from 'src/comments/controllers/comments.controller';
import { CommentsService } from 'src/comments/services/comments.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}

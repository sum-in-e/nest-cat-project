import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comments, CommentsSchema } from 'src/comments/comments.schema';
import { CommentsController } from 'src/comments/controllers/comments.controller';
import { CommentsService } from 'src/comments/services/comments.service';
import { CatsModule } from 'src/cats/cats.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comments.name, schema: CommentsSchema },
    ]),
    CatsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}

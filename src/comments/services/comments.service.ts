import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CatsRepository } from 'src/cats/cats.repository';
import { Comments } from 'src/comments/comments.schema';
import { CreateCommentsDto } from 'src/comments/dto/comments.create.dto';

@Injectable()
export class CommentsService {
  // * 의존성 주입
  constructor(
    @InjectModel(Comments.name) private readonly commentsModel: Model<Comments>,
    private readonly catsRepository: CatsRepository,
  ) {}

  async getAllComments() {
    try {
      const allComments = await this.commentsModel.find();
      return allComments;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createComment(targetCatId: string, comment: CreateCommentsDto) {
    try {
      const { authorId, content } = comment;

      const targetCat = await this.catsRepository.findCatByIdWithoutPassword(
        targetCatId,
      );

      const validatedAuthor =
        await this.catsRepository.findCatByIdWithoutPassword(authorId);

      const newComment = new this.commentsModel({
        targetId: targetCat._id,
        authorId: validatedAuthor._id,
        content,
      });

      return await newComment.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async plusLike(contentId: string) {
    try {
      const comment = await this.commentsModel.findById(contentId);
      comment.likeCount += 1;

      return await comment.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

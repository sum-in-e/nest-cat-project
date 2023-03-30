import { Injectable } from '@nestjs/common';
import { CreateCommentsDto } from 'src/comments/dto/comments.create.dto';

@Injectable()
export class CommentsService {
  async getAllComments() {
    return 'getAllComments';
  }

  async createComment(id: string, comment: CreateCommentsDto) {
    return 'createComment';
  }

  async plusLike(id: string) {
    return 'plusLike';
  }
}

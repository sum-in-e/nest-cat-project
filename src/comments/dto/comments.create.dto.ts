import { PickType } from '@nestjs/swagger';
import { Comments } from 'src/comments/comments.schema';

export class CreateCommentsDto extends PickType(Comments, [
  'authorId',
  'content',
] as const) {}

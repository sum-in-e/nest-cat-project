import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateCommentsDto } from 'src/comments/dto/comments.create.dto';
import { CommentsService } from 'src/comments/services/comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({
    summary: '모든 고양이 프로필에 적힌 댓글 가져오기',
  })
  @Get()
  async getAllComments() {
    return this.commentsService.getAllComments();
  }

  @ApiOperation({
    summary: '특정 고양이 프로필에 댓글 남기기',
  })
  @Post(':targetCatId')
  async createContent(
    @Param('targetCatId') targetCatId: string,
    @Body() body: CreateCommentsDto,
  ) {
    return this.commentsService.createComment(targetCatId, body);
  }

  @ApiOperation({
    summary: '좋아요 수 올리기',
  })
  @Patch(':contentId')
  async plusLike(@Param('contentId') contentId: string) {
    return this.commentsService.plusLike(contentId);
  }
}

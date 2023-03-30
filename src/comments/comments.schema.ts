import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { Document, Types } from 'mongoose';

const options: SchemaOptions = {
  //   collection:
  // * '스키마 이름도 적어줄 수 있는데 미지정 시 현재 Document의 이름에서 소문자 시작 + 복수형으로 mongoose가 자동 생성한다.',
  timestamps: true,
};

@Schema(options)
export class Comments extends Document {
  @ApiProperty({
    description: '작성 대상인 고양이의 id',
    required: true,
  })
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'cats', //* 스키마에서 어떤 Document(스키마)랑 연결을 할지 설정 -> Cat Document에 ref 지정 안해서 cats로 자동 생성 됨
  })
  @IsNotEmpty()
  id: Types.ObjectId;

  @ApiProperty({
    description: '댓글을 단 고양이 id',
    required: true,
  })
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'cats',
  })
  @IsNotEmpty()
  authorId: Types.ObjectId;

  @ApiProperty({
    description: '좋아요 수',
  })
  @Prop({
    default: 0,
  })
  @IsPositive() //* 양수
  likeCount: number;

  @ApiProperty({
    description: '댓글 내용',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);

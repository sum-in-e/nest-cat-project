import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Document } from 'mongoose';
import { Comments } from 'src/comments/comments.schema';

const options: SchemaOptions = {
  timestamps: true, // * DB에서 하나가 생성될 때 생성일자, 업데이트 일자를 찍어준다.
};

// * Schema 데코레이션으로 스키마 정의
// * options는 스키마의 옵션
@Schema(options)

// * Mongoose의 Document를 상속 받은 Cat이라는 스키마를 설계
export class Cat extends Document {
  @ApiProperty({
    example: 'suminkim.me@gmail.com',
    description: 'email',
    required: true,
  })
  @Prop({
    required: true, // default: false
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '김수민',
    description: 'name',
    required: true,
  })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'asdf1234**',
    description: 'password',
    required: true,
  })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: '고양이 이미지',
  })
  @Prop({
    default:
      'https://github.com/amamov/teaching-nestjs-a-to-z/blob/main/images/1.jpeg?raw=true', // * default 설정
  })
  @IsString()
  imgUrl: string;

  // *readOnlyData를 가상으로 만들어서 제공한다. 따라서 실제 DB에는 없는 필드임.
  readonly readOnlyData: {
    id: string;
    email: string;
    name: string;
    imgUrl: string;
    comments: Comments[];
  };

  readonly comments: Comments[];
}

// * Class인 Cat을 스키마로 만들어준다. 따라서 실질적 스키마는 CatSchema가 된다.
const _CatSchema = SchemaFactory.createForClass(Cat);

// virtual 메서드를 사용해 virtual 필드를 생성한다.
// readOnlyData란? 보여줄 데이터만 가상으로 필터링해서 나간다.
// 지금 상황의 경우 유저에게 보여줄 필요가 있는 데이터만 결과적으로 전달하기 위해 virtual 필드를 만든 것.
_CatSchema.virtual('readOnlyData').get(function (this: Cat) {
  return {
    id: this.id,
    email: this.email,
    name: this.name,
    imgUrl: this.imgUrl,
    Comments: this.comments,
  };
});

// * populate? 다른 doc과 이어줄 수 있는 메서드
_CatSchema.virtual('comments', {
  ref: 'comments', // 어떤 스키마랑 연결할지
  localField: '_id', // 현재 스키마의 어떤 필드랑 연결할지
  foreignField: 'targetId', // 연결할 스키마의 어떤 필드랑 연결할지
});

// * populate를 사용하기 위해서는 아래 두개의 옵션 설정이 권장됨
_CatSchema.set('toObject', { virtuals: true }); // virtual 필드를 JSON으로 변환할 때 포함시킨다.
_CatSchema.set('toJSON', { virtuals: true }); // virtual 필드를 JSON으로 변환할 때 포함시킨다.

export const CatSchema = _CatSchema;

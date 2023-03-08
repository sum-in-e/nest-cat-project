import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Document } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true, // * DB에서 하나가 생성될 때 생성일자, 업데이트 일자를 찍어준다.
};

// * Schema 데코레이션으로 스키마 정의
// * options는 스키마의 옵션
@Schema(options)

// * Mongoose의 Document를 상속 받은 Cat이라는 스키마를 설계
export class Cat extends Document {
  @Prop({
    // * Prop에 대한 추가적인 옵션을 설정해야한다.
    required: true, // default: false
    unique: true,
  })

  // * 필드 각각에 validation을 해야한다. 여기서는 이메일 형식인지 검증하는 것.
  // * nest에서 class-validator 라이브러리를 제공한다.
  // * yarn add class-validator class-transformer --save
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  password: string;

  @IsString()
  @Prop()
  imgUrl: string;
}

// * Class인 Cat을 스키마로 만들어준다. 따라서 실질적 스키마는 CatSchema가 된다.
export const CatSchema = SchemaFactory.createForClass(Cat);

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
    required: true, // default: false
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Prop()
  @IsString()
  imgUrl: string;

  // *readOnlyData를 가상으로 만들어서 제공한다. 따라서 실제 DB에는 없는 필드임.
  readonly readOnlyData: {
    id: string;
    email: string;
    name: string;
  };
}

// * Class인 Cat을 스키마로 만들어준다. 따라서 실질적 스키마는 CatSchema가 된다.
export const CatSchema = SchemaFactory.createForClass(Cat);

// * virtual 메서드를 사용해 virtual 필드를 생성한다.
// * readOnlyData란? 보여줄 데이터만 가상으로 필터링해서 나간다.
// * 지금 상황의 경우 유저에게 보여줄 필요가 있는 데이터만 결과적으로 전달하기 위해 virtual 필드를 만든 것.
CatSchema.virtual('readOnlyData').get(function (this: Cat) {
  return {
    id: this.id,
    email: this.email,
    name: this.name,
  };
});

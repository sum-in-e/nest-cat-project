import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cat } from './cats.schema';
import { CatRequestDto } from './dto/cats.request.dto';

@Injectable()
export class CatsRepository {
  // * 스키마와 인터페이스를 사용하여 모델 객체를 생성
  constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}

  // * DB와 통신하는 메소드 정의
  async existByEmail(email: string): Promise<boolean> {
    try {
      const result = await this.catModel.exists({ email });
      return result._id ? true : false;
    } catch (error) {
      throw new HttpException('DB Error', 400);
    }
  }
  // * DB와 통신하는 메소드 정의
  async createByEmail(cat: CatRequestDto): Promise<Cat> {
    return await this.catModel.create(cat);
  }
}

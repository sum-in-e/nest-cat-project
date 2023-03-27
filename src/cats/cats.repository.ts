import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cat } from './cats.schema';
import { CatRequestDto } from './dto/cats.request.dto';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class CatsRepository {
  // * 스키마와 인터페이스를 사용하여 모델 객체를 생성
  constructor(
    @InjectModel(Cat.name) private readonly catModel: Model<Cat>,
    private httpService: HttpService,
  ) {}

  async existByEmail(email: string): Promise<boolean> {
    const result = await this.catModel.exists({ email });
    return !!result;
  }

  async createByEmail(cat: CatRequestDto): Promise<Cat> {
    return await this.catModel.create(cat);
  }

  async findCatByEmail(email: string): Promise<Cat | null> {
    const cat = await this.catModel.findOne({ email });
    return cat;
  }

  async findCatByIdWithoutPassword(id: string): Promise<Cat | null> {
    // * 보안상 이유로 request.use에 저장할 때 password 필드를 제외하고 저장하는 것이 좋다.
    const cat = await this.catModel.findById(id).select('-password'); // * select -> 원하는 필드를 고를 수 있는데 -를 붙이면 해당 필드를 제외하고 가져온다. email과 name을 가져오고 싶으면 select('email name') 으로 가져온다
    return cat;
  }

  async findByIdAndUpdateImg(id: string, fileName: string) {
    const cat = await this.catModel.findById(id);

    const config: AxiosRequestConfig = {
      url: 'https://dog.ceo/api/breeds/image/random',
      method: 'GET',
    };

    const res = await this.httpService.request(config).toPromise();
    const dogImageUrl = res.data.message;

    cat.imgUrl = dogImageUrl;

    const newCat = await cat.save(); // * 업데이트된것을 저장
    console.log('newCat', newCat);
    return newCat.readOnlyData;
  }

  async findAllCat(): Promise<Cat[] | null> {
    return await this.catModel.find();
  }
}

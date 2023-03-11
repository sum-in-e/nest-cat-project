import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { CatsService } from './cats.service';
import { CatRequestDto } from './dto/cats.request.dto';

@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  getCurrentCat() {
    return 'current cat';
  }

  @Post('signup')
  //* @Body를 이용해서 client에서 보내는 body 값을 가져올 수 있다.
  async signUp(@Body() body: CatRequestDto) {
    //* 받아올 body에 대한 validation 필요하다 -> 클라이언트가 body로 보낸 데이터를 DTO 객체로 만들어서 validation하고 타입핑 검사한 후에 DTO 객체를 Controller -> Service -> DB로 안전하게 보낸다.
    //* DTO(Data Transfer Object) 계층간 데이터 교환을 위한 객체
    //* CatRequestDto를 cats/dto 폴더에 만들어 body 타입에 적용해준다.
    console.log(body);

    //* 핸들러 함수내에서 비즈니스 로직을 수행하기 위해 Service를 찾아 실행한다. 서비스가 promise를 리턴하므로 await 필요
    return await this.catsService.signUp(body);
  }

  @Post('login')
  logIn() {
    return 'log in';
  }

  @Post('logout')
  logOut() {
    return 'log out';
  }

  @Post('upload/cats')
  uploadCatImg() {
    return 'uploadImg';
  }
}

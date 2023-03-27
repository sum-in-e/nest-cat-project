import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { multerOptions } from 'src/common/utils/multer.options';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { Cat } from '../cats.schema';
import { ReadOnlyCatDto } from '../dto/cat.dto';
import { CatRequestDto } from '../dto/cats.request.dto';
import { CatsService } from '../services/cats.service';

@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@Controller('cats')
export class CatsController {
  constructor(
    private readonly catsService: CatsService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '현재 고양이 가져오기' })
  @UseGuards(JwtAuthGuard) // * middleware -> guard 순으로 실행될 떄 guard에서 인증 처리를 해준다
  @Get()
  getCurrentCat(@CurrentUser() cat: Cat) {
    return cat.readOnlyData; // * virtual filed로 만든 readOnlyData로 클라이언트에 필요한 정보만 response로 주게 해놔서 이를 사용
  }

  @ApiResponse({
    status: 500,
    description: '서버 에러🚨',
  })
  @ApiResponse({
    status: 200,
    description: '성공✌🏻',
    type: ReadOnlyCatDto,
  })
  @ApiOperation({ summary: '회원가입' })
  @Post()
  //* @Body를 이용해서 client에서 보내는 body 값을 가져올 수 있다.
  async signUp(@Body() body: CatRequestDto) {
    //* 받아올 body에 대한 validation 필요하다 -> 클라이언트가 body로 보낸 데이터를 DTO 객체로 만들어서 validation하고 타입핑 검사한 후에 DTO 객체를 Controller -> Service -> DB로 안전하게 보낸다.
    //* DTO(Data Transfer Object) 계층간 데이터 교환을 위한 객체
    //* CatRequestDto를 cats/dto 폴더에 만들어 body 타입에 적용해준다.
    console.log(body);

    //* 핸들러 함수내에서 비즈니스 로직을 수행하기 위해 Service를 찾아 실행한다. 서비스가 promise를 리턴하므로 await 필요
    return await this.catsService.signUp(body);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@Body() body: LoginRequestDto) {
    return this.authService.jwtLogIn(body);
  }

  @ApiOperation({ summary: '고양이 업로드' })
  @Post('upload')
  @UseInterceptors(FilesInterceptor('image', 10, multerOptions('cats'))) // * 첫 번째 인자: file 받을 때 쓸 필드명, 두 번째 인자 options
  @UseGuards(JwtAuthGuard)
  uploadCatImg(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() cat: Cat,
  ) {
    // * JWT token으로 디코딩해서 현재 유저를 가져와 uploadImg 서비스 함수에 현재 로그인된 cat을 전달한다.
    return this.catsService.uploadImg(cat, files);
  }
}

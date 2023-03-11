import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

//* 상속을 통한 DTO 확장도 가능하기 때문에 class를 사용한다.
export class CatRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

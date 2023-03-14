import { PickType } from '@nestjs/swagger';
import { Cat } from '../cats.schema';

//* class를 사용할 경우 상속을 받아 재사용성을 높일 수 있다.
//* 상속을 통한 DTO 확장도 가능하기 때문에 class를 사용한다.
export class CatRequestDto extends PickType(Cat, [
  'email',
  'password',
  'name',
] as const) {}

import { ApiProperty, PickType } from '@nestjs/swagger';
import { Cat } from '../cats.schema';

//* 회원가입 service에서 readOnlyData를 내보냈기 때문에 이를 정의해준다.
//* Cat 스키마를 확장사용할 경우 readOnlyData에는 포함시키면 안되는 항목인 password가 들어가므로 PickType으로 필요한 것만 가져온다.
//* OmitType은 필요없는 것을 선언해서 빼는 것, PickType은 필요한 것을 선언해서 가져오는 것
export class ReadOnlyCatDto extends PickType(Cat, ['email', 'name'] as const) {
  @ApiProperty({
    example: '0068424',
    description: 'id',
  })
  id: string;
}

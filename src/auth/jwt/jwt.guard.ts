import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// * @Injectable 데코레이터를 사용했기때문에 JwtAuthGuard 클래스 역시 의존성 주입이 가능하다
// * AuthGuard는 strategy를 자동으로 실행해주는 기능이 있다. -> 여기서는 jwt.strategy.ts를 실행해줌
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

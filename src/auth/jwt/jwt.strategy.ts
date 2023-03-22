import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from './jwt.payload';
import { CatsRepository } from 'src/cats/cats.repository';

// * JwtStrategy는 인증할 때 사용한다.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // * CatsRepository 의존성 주입 필요
  constructor(private readonly catsRepository: CatsRepository) {
    // * JWT에 대한 설정
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // * header의 token으로부터 JWT추출
      secretOrKey: process.env.JWT_SECRET, // * secretKey를 통해 디코딩하여 request.user에 유저 정보를 넘겨준다. 추후 환경변수로 저장할 것.
      ignoreExpiration: false, // * JWT 만료 기간 설정
    });
  }
  // * strategy가 validate를 실행한다.
  // * 그전에 auth.module.ts에 인증을 위한 설정을 해줘야한다.
  // * jwt가 왔을 때 그것을 읽고 payload를 뽑아냈다면 이를 유효성 검증해야한다.
  async validate(payload: Payload) {
    // * decoding된 payload가 적합한지 체크한다.
    const cat = await this.catsRepository.findCatByIdWithoutPassword(
      payload.sub, // * auth.service.ts에서 sub: cat.id로 했었기 때문에 payload.sub은 cat.id가 된다.
    );

    if (cat) {
      return cat; // * request.user에 들어가게 된다.
    } else {
      throw new UnauthorizedException();
    }
  }
}

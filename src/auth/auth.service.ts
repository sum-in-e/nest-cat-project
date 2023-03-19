import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CatsRepository } from 'src/cats/cats.repository';
import { LoginRequestDto } from './dto/login.request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  // * cats.module의 컨트롤러에서 사용할 로그인 서비스 구현
  // * catDB를 쓰기 위해 종속성 주입을 한다.
  // * CatsRepository를 의존성 주입하기 위해 authModule에 CatsModule을 import하여 CatsModule에서 export하는 CatsRepository를 사용 가능하도록 함
  // * 단, CatsModule에서 CatsRepository를 exports 배열에 넣어놔야 캡슐화가 해제되어 접근이 가능하다.
  constructor(
    private readonly catsRepository: CatsRepository,
    private jwtService: JwtService,
  ) {}

  async jwtLogIn(data: LoginRequestDto) {
    const { email, password } = data;

    // * 1. 해당 email이 존재하는지 확인
    const cat = await this.catsRepository.findCatByEmail(email);

    if (!cat) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }

    // * 2. email이 존재한다면 password가 일치하는지 확인
    const isPasswordValidated: boolean = await bcrypt.compare(
      password, // * 받아온 비밀번호
      cat.password, // * 비교할 비밀번호
    ); // * 회원가입시 bcrypt를 이용해 비밀번호를 hash화 했기 때문에 비밀번호 일치여부를 확인할때도 bcrypt를 사용한다.

    if (!isPasswordValidated) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }

    // * 3. 클라이언트에 JWT 만들어서 반환 - 이를 위해 JwtService를 의존성 주입하여 사용해야한다.
    // * constructor에 JwtService를 의존성 주입하기 위해서는 authModule에  JwtModule.register()를 해줘야한다.

    // * JWT를 만들기 위해서는 header, payload, signature가 필요하다.
    // * signature는 header, payload를 조합하고 authModule에서 JwtModule.register에 설정한 secretKey로 서명하여 base64로 인코딩한 것이다.

    // * header는 nestJwt에 설정이 되어있다.
    // * payload를 직접 만들어준다.
    const payload = { email: email, sub: cat.id }; // * sub? 토큰 제목

    // * payload를 jwtService.sign()에 넣어서 토큰을 만든다. -> header.payload.signature 구조로 이뤄진 JWT토큰이 됨
    return {
      token: this.jwtService.sign(payload),
    };
  }
}

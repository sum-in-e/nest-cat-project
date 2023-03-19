import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CatsModule } from 'src/cats/cats.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    // * PassportModule.register에서는 만들 strategy에 대하여 기본 설정을 할 수 있다.
    // * strategy가 validate를 실행하도록 하기 위해서는 기본 설정을 해줘야한다.
    // * session 쿠키는 사용하지 않을 것이기 때문에 false 처리
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),

    // * JwtModule.register는 로그인 시 쓰이는 것. JwtService를 authSevice에 의존성 주입하기 위해서는 반드시 필요하다.
    // * JWT를 만들어준다.
    JwtModule.register({
      secret: 'secret', // * jwt.strategy의 secretKey와 동일하게 설정해야한다.
      signOptions: { expiresIn: '1y' }, // * 만료기간 1년
    }),
    forwardRef(() => CatsModule),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}

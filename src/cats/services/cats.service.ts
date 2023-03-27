import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CatsRepository } from 'src/cats/cats.repository';
import { Cat } from 'src/cats/cats.schema';
import { CatRequestDto } from 'src/cats/dto/cats.request.dto';

@Injectable()
export class CatsService {
  // * Repository 레이어로 DB에 접근할 것이기 때문에 기존 로직은 삭제
  // constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}
  // * DB 로직을 작성한 CatsRepository를 의존성 주입
  constructor(private readonly catsRepository: CatsRepository) {}

  // * 회원가입 비즈니스 로직
  async signUp(body: CatRequestDto) {
    const { email, password, name } = body;
    const isCatExist = await this.catsRepository.existByEmail(email);

    // * 1. 데이터 유효성 검사
    if (isCatExist) {
      throw new UnauthorizedException(
        '입력하신 고양이는 이미 존재하는 고양이입니다.',
      );
    }

    // * 2. pw 암호화 (bycript 라이브러리를 사용하여 hash 값으로 변환)
    const hashedPassword = await bcrypt.hash(password, 10);

    // * 3. DB에 저장하기 -> 쿼리 사용해야함. 스키마를 서비스 안에서 사용하려면 의존성 주입을 해줘야한다.
    const cat = await this.catsRepository.createByEmail({
      email,
      name,
      password: hashedPassword,
      // * 문제: 여기까지만 작업하면 비밀번호가 클라이언트에도 response로 넘어감.
      // * DB에 저장은 하되 실제 유저에게 내려줄때는 보여줄 필요 없는 데이터를 빼고 내려줘야한다.
      // * 스키마에서 mongoose가 제공하는 virtual field를 이용해 필요한 필드만 response로 내려주도록 설정한다.
    });

    // * 작업 결과를 Controller에 Return한다.
    return cat.readOnlyData; // * DB에 저장한 cat이 아닌 스키마에 만든 virtual field인 readOnlyData를 return
  }

  // * 이미지 업로드 비즈니스 로직
  async uploadImg(cat: Cat, files: Express.Multer.File[]) {
    const fileName = `cats/${files[0].filename}`;

    console.log(fileName);

    const newCat = await this.catsRepository.findByIdAndUpdateImg(
      cat.id,
      fileName,
    );
    console.log(newCat);
    return newCat;
  }
}

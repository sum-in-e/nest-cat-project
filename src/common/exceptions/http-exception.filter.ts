import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // context -> 실행 환경
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const error = exception.getResponse() as
      | string
      | { error: string; statusCode: number; message: string | string[] };

    // error는 string, object 두개 올 수 있는데
    // string으로 오는 경우는 라우트에서 에러를 던지면서 인자값으로 문자열 메세지를 던진 경우임
    // 원하는 에러 response를 만들기 위해서 타입별로 응답 분기처리해보자
    if (typeof error === 'string') {
      response.status(status).json({
        success: false,
        timestamp: new Date().toISOString(),
        path: request.url,
        error,
      });
    } else {
      response.status(status).json({
        success: false,
        timestamp: new Date().toISOString(),
        path: request.url,
        ...error,
      });
    }

    // response.status(400).send({}); express에서는 이랬는데 nest에서는 아래처럼 됨
    // response.status(status).json({
    //   success: false,
    //   error,
    //   timestamp: new Date().toISOString(),
    //   path: request.url,
    // });
  }
}

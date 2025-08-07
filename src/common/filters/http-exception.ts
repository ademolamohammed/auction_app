import { HttpException, HttpStatus } from '@nestjs/common';
import { Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { throwError } from 'rxjs';

interface IHttpError {
  statusCode: HttpStatus;
  status: number;
  success: boolean;
  message: string;
}

export class HttpExceptionError extends HttpException {
  constructor(error: IHttpError & any) {
    if (error.response) throw error;
    const { statusCode, success, message } = error;
    super({ success, message }, statusCode);
  }
}

@Catch()
export class HttpExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const existsAndFunction = (item) => typeof exception[item] !== 'undefined' && typeof exception[item] === 'function';
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception?.response?.status || exception.status || (exception && existsAndFunction('getStatus') && exception?.getStatus()) || exception.statusCode || HttpStatus.EXPECTATION_FAILED;
    const errorResponse: any = (exception && existsAndFunction('getResponse') && exception.getResponse()) || { message: exception.message || exception || 'Invalid Request' };
    if (host.getType() == 'rpc') return throwError(() => exception);
    response.status(status).json({
      statusCode: status,
      success: false,
      message: exception.message || errorResponse.message,
      error: exception?.response?.response || exception.response || exception,
    });
  }
}

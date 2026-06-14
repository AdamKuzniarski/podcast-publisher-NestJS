import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiErrorResponse } from './api-error-response';
import { ErrorCode } from './error-code';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const body = this.buildResponse(exception);
    response.status(body.status).json(body);
  }

  buildResponse(exception: unknown): ApiErrorResponse {
    if (exception instanceof BadRequestException) {
      const res = exception.getResponse() as Record<string, unknown>;
      const fieldErrors =
        res && typeof res === 'object' && res.fieldErrors
          ? (res.fieldErrors as Record<string, string>)
          : undefined;
      return {
        status: 400,
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Request validation failed.',
        ...(fieldErrors ? { fieldErrors } : {}),
      };
    }

    if (exception instanceof UnauthorizedException) {
      return {
        status: 401,
        code: ErrorCode.UNAUTHORIZED,
        message: 'Unauthorized.',
      };
    }

    if (exception instanceof ConflictException) {
      return { status: 409, code: ErrorCode.CONFLICT, message: 'Conflict.' };
    }

    if (exception instanceof NotFoundException) {
      return { status: 404, code: ErrorCode.NOT_FOUND, message: 'Not found.' };
    }

    if (exception instanceof HttpException) {
      return {
        status: exception.getStatus(),
        code: ErrorCode.INTERNAL,
        message: 'An unexpected error occurred.',
      };
    }

    return {
      status: 500,
      code: ErrorCode.INTERNAL,
      message: 'An unexpected error occurred.',
    };
  }
}

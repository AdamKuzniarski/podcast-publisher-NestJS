import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';
import { ErrorCode } from './error-code';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
  });

  describe('buildResponse', () => {
    it('maps BadRequestException with fieldErrors to VALIDATION_ERROR', () => {
      const fieldErrors = {
        email: 'must be an email',
        password: 'must not be empty',
      };
      const exception = new BadRequestException({ fieldErrors });
      const result = filter.buildResponse(exception);

      expect(result.status).toBe(400);
      expect(result.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(result.message).toBe('Request validation failed.');
      expect(result.fieldErrors).toEqual(fieldErrors);
    });

    it('maps BadRequestException without fieldErrors to VALIDATION_ERROR', () => {
      const exception = new BadRequestException('Bad input');
      const result = filter.buildResponse(exception);

      expect(result.status).toBe(400);
      expect(result.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(result.message).toBe('Request validation failed.');
      expect(result.fieldErrors).toBeUndefined();
    });

    it('maps UnauthorizedException to UNAUTHORIZED', () => {
      const result = filter.buildResponse(new UnauthorizedException());

      expect(result.status).toBe(401);
      expect(result.code).toBe(ErrorCode.UNAUTHORIZED);
      expect(result.message).toBe('Unauthorized.');
    });

    it('maps ConflictException to CONFLICT', () => {
      const result = filter.buildResponse(new ConflictException());

      expect(result.status).toBe(409);
      expect(result.code).toBe(ErrorCode.CONFLICT);
      expect(result.message).toBe('Conflict.');
    });

    it('maps NotFoundException to NOT_FOUND', () => {
      const result = filter.buildResponse(new NotFoundException());

      expect(result.status).toBe(404);
      expect(result.code).toBe(ErrorCode.NOT_FOUND);
      expect(result.message).toBe('Not found.');
    });

    it('maps unknown errors to INTERNAL with status 500', () => {
      const result = filter.buildResponse(new Error('unexpected'));

      expect(result.status).toBe(500);
      expect(result.code).toBe(ErrorCode.INTERNAL);
      expect(result.message).toBe('An unexpected error occurred.');
    });
  });
});

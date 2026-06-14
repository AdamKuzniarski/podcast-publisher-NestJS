import { Test } from '@nestjs/testing';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { GlobalExceptionFilter } from '../../src/common/errors/global-exception.filter';

export async function createTestApp(): Promise<INestApplication> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const fieldErrors: Record<string, string> = {};
        for (const err of errors) {
          fieldErrors[err.property] =
            Object.values(err.constraints ?? {})[0] ?? 'Invalid value';
        }
        return new BadRequestException({ fieldErrors });
      },
    }),
  );
  await app.init();
  return app;
}

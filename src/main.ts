import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/errors/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port')!;
  const corsOrigins = configService.get<string[]>('app.corsOrigins')!;

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
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
  app.enableCors({ origin: corsOrigins });

  await app.listen(port);
}
bootstrap();

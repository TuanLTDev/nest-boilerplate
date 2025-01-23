import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  HttpStatus,
  RequestMethod,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ResponseInterceptor } from '@core/interceptors/response.interceptor';
import { GlobalExceptionFilter } from '@core/filters/global-exception.filter';
import { setupSwagger } from '@core/utils/setup-swagger';
import { AuthGuard } from '@core/guards/auth.guard';
import { JwtUtil } from '@core/utils/jwt.util';
import { AuthService } from '@modules/auth/auth.service';
import * as compression from 'compression';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import { AllConfigType } from '@config/config.type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));
  app.use(helmet());
  app.use(compression());

  const configService = app.get<ConfigService>(ConfigService<AllConfigType>);
  const port = configService.get<number>('app.port', { infer: true });

  const corsOrigin = configService.getOrThrow<string>('app.corsOrigin', {
    infer: true,
  });
  const appUrl = configService.getOrThrow<string>('app.url', { infer: true });

  app.setGlobalPrefix(configService.getOrThrow('app.apiPrefix', { infer: true }), {
    exclude: [
      { method: RequestMethod.GET, path: '/' },
      { method: RequestMethod.GET, path: 'health' },
    ],
  });

  app.enableCors({
    origin: corsOrigin,
    methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept', 'Cookie'],
    credentials: true,
  });
  console.info('CORS Origin:', corsOrigin);
  const reflector = app.get(Reflector);

  app.setGlobalPrefix(configService.getOrThrow('app.apiPrefix', { infer: true }), {
    exclude: [
      { method: RequestMethod.GET, path: '/' },
      { method: RequestMethod.GET, path: 'health' },
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException(errors);
      },
    }),
  );
  app.useGlobalGuards(new AuthGuard(reflector, app.get(JwtUtil), app.get(AuthService)));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter(configService));
  setupSwagger(app);
  await app.listen(port);
  console.log(new Date().toString());
  console.log(`api docs at: ${appUrl}/docs`);
}

void bootstrap();

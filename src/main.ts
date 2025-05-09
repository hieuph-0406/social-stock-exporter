import { AppConfigService } from '@/shared/services/app-config.service';
import { SharedModule } from '@/shared/shared.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { ValidateException } from './exceptions/validate.exception';
import { transformValidateObject } from './utilities/app.util';
import { setupSwagger } from './utilities/setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));

  const configService = app.select(SharedModule).get(AppConfigService);

  // For high-traffic websites in production, it is strongly recommended to offload compression from the application server - typically in a reverse proxy (e.g., Nginx). In that case, you should not use compression middleware.
  app.use(compression());

  // Setup security headers
  app.use(helmet());

  // Setup cors
  app.enableCors({
    origin: configService.appConfig.corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  console.log('\nCORS Origin:', configService.appConfig.corsOrigin);

  // Use global pipes
  app.useGlobalPipes(
    // apply validation pipe
    new ValidationPipe({
      transform: true,
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      exceptionFactory: (errors) =>
        new ValidateException(transformValidateObject(errors)),
    }),
  );

  // Setup Swagger
  if (configService.isDevelopment) {
    SwaggerModule.setup('api', app, setupSwagger(app), {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  await app.listen(configService.appConfig.port);

  console.info(`Server running on ${await app.getUrl()}`);

  return app;
}

void bootstrap();

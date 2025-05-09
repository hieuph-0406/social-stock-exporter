import { setupSwagger } from '@/utilities/setup-swagger';
import { NestFactory } from '@nestjs/core';
import fs from 'fs';
import YAML from 'yaml';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const data = YAML.stringify(setupSwagger(app));
  fs.writeFileSync('./swagger.yaml', data);
  await app.close();
}

bootstrap();

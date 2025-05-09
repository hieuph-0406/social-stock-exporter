import { ApiModule } from '@/api/api.module';
import { AppConfigService } from '@/shared/services/app-config.service';
import { SharedModule } from '@/shared/shared.module';
import { ModuleMetadata } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { DataSource, DataSourceOptions } from 'typeorm';
import { loggerFactory } from './setup-logger.util';

export function generateModulesSet() {
  const imports: ModuleMetadata['imports'] = [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
  ];

  let customModules: ModuleMetadata['imports'] = [];

  const dbModule = TypeOrmModule.forRootAsync({
    imports: [SharedModule],
    inject: [AppConfigService],
    useFactory: (config: AppConfigService) =>
      config.postgresConfig as DataSourceOptions,
    dataSourceFactory: (options: DataSourceOptions) => {
      if (!options) {
        throw new Error('Invalid options passed');
      }

      return new DataSource(options).initialize();
    },
  });

  const loggerModule = LoggerModule.forRootAsync({
    imports: [SharedModule],
    inject: [AppConfigService],
    useFactory: loggerFactory,
  });

  const modulesSet = process.env.MODULES_SET || 'monolith';

  switch (modulesSet) {
    case 'monolith':
      customModules = [ApiModule, dbModule, loggerModule];
      break;
    default:
      console.error(`Unsupported modules set: ${modulesSet}`);
      break;
  }

  return imports.concat(customModules);
}

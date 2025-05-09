import { AppConfig, MailerConfig } from '@/types/config.type';
import TypeOrmCustomLogger from '@/utilities/typeorm-custom-logger';
import { Injectable } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { type LoggerOptions } from 'typeorm';

@Injectable()
export class AppConfigService {
  readonly appConfig: AppConfig;

  constructor(private readonly configService: ConfigService) {
    this.appConfig = this.getAppConfig();
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isStaging(): boolean {
    return this.nodeEnv === 'staging';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get postgresConfig(): TypeOrmModuleOptions {
    const entities = [
      __dirname + '/../../**/*.entity{.ts,.js}',
      __dirname + '/../../**/*.view-entity{.ts,.js}',
    ];

    return Object.freeze({
      entities,
      keepConnectionAlive: !this.isTest,
      dropSchema: this.isTest,
      type: 'postgres',
      host: this.getString('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.getString('DB_USERNAME'),
      password: this.getString('DB_PASSWORD'),
      database: this.getString('DB_NAME'),
      extra: {
        ssl: this.getBoolean('DB_USE_SSL'),
        charset: 'utf8mb4_general_ci',
      },
      logger: TypeOrmCustomLogger.getInstance(
        'default',
        this.getArray('ENABLE_ORM_LOGS') as LoggerOptions,
      ),
    });
  }

  private getAppConfig(): AppConfig {
    return {
      port: this.getString('APP_PORT') || '3000',
      appUrl: this.getString('APP_URL'),
      timeout: this.getNumber('APP_TIMEOUT'),
      debug: this.getBoolean('APP_DEBUG'),
      corsOrigin: this.getCorsOrigin,
      logLevel: this.getString('LOG_LEVEL'),
      logPretty: this.getBoolean('LOG_PRETTY'),
      mailer: this.mailerConfig,
    };
  }

  private get getCorsOrigin(): boolean | string | RegExp | (string | RegExp)[] {
    const corsOrigin = this.get('APP_CORS_ORIGIN');
    if (corsOrigin === 'true') return true;
    if (corsOrigin === '*') return '*';
    if (!corsOrigin || corsOrigin === 'false') return false;
    return this.parseArray(corsOrigin);
  }

  private get mailerConfig(): MailerConfig {
    return {
      mailFrom: this.getString('MAIL_FROM'),
      sendGridApiKey: this.getString('SEND_GRID_API_KEY'),
    };
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    if (isNaN(Number(value))) {
      throw new Error(`AppConfigService: ${key} is not a number`);
    }

    return Number(value);
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(`AppConfigService: ${key} is not a boolean`);
    }
  }

  private getString(key: string): string {
    const value = this.get(key);
    return value.replaceAll('\\n', '\n');
  }

  private getArray(key: string): string[] {
    const value = this.get(key);
    try {
      return this.parseArray(value);
    } catch {
      throw new Error(
        `AppConfigService: ${key} is not a array (value1,value2,value3,...)`,
      );
    }
  }

  private parseArray(value: string): string[] {
    const items = value.split(',').map((item) => item.trim());

    if (items.includes('')) {
      throw new Error('AppConfigService: Array contains empty values');
    }

    return items;
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(`AppConfigService: ${key} is not defined`);
    }

    return value;
  }
}

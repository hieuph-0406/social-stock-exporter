import { AppConfigService } from '@/shared/services/app-config.service';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { ApiPublic } from '../decorators/http.decorator';
import { Public } from '../decorators/public.decorator';

@ApiTags('HealthCheck')
@Controller('health')
export class HealthController {
  constructor(
    private configService: AppConfigService,
    private healthCheckService: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @Public()
  @ApiPublic()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    const list = [
      () => this.db.pingCheck('database'),
      ...(this.configService.isDevelopment
        ? [
            () =>
              this.http.pingCheck(
                'api-docs',
                `http://localhost:${this.configService.appConfig.port}/api`,
              ),
          ]
        : []),
    ];
    return this.healthCheckService.check(list);
  }
}

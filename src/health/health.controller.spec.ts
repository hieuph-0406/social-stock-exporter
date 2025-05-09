import { HealthController } from '@/health/health.controller';
import { AppConfigService } from '@/shared/services/app-config.service';
import {
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';

describe('HealthController', () => {
  let controller: HealthController;
  let service: HealthCheckService;

  let serviceUseValue: Partial<Record<keyof HealthCheckService, jest.Mock>>;
  let httpUseValue: Partial<Record<keyof HttpHealthIndicator, jest.Mock>>;
  let dbUseValue: Partial<Record<keyof TypeOrmHealthIndicator, jest.Mock>>;
  const appConfigServiceUseValue = {
    isDevelopment: false,
    appConfig: {
      port: '3000',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    serviceUseValue = {
      check: jest.fn(),
    };
    httpUseValue = {
      pingCheck: jest.fn(),
    };
    dbUseValue = {
      pingCheck: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: serviceUseValue,
        },
        {
          provide: AppConfigService,
          useValue: appConfigServiceUseValue,
        },
        {
          provide: HttpHealthIndicator,
          useValue: httpUseValue,
        },
        {
          provide: TypeOrmHealthIndicator,
          useValue: dbUseValue,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    service = module.get<HealthCheckService>(HealthCheckService);
  });

  describe('check', () => {
    it('should include api-docs check in development mode', async () => {
      const healthCheckResult = { status: 'ok' };

      serviceUseValue.check.mockResolvedValueOnce(healthCheckResult);
      dbUseValue.pingCheck.mockResolvedValueOnce({ status: 'up' });
      httpUseValue.pingCheck.mockResolvedValueOnce({ status: 'up' });
      appConfigServiceUseValue.isDevelopment = false;

      const result = await controller.check();

      expect(result).toEqual(healthCheckResult);
      const expectedParams = [expect.any(Function)];
      expect(service.check).toHaveBeenCalledWith(expectedParams);
    });
    it('should include api-docs check in another mode', async () => {
      const healthCheckResult = { status: 'ok' };

      serviceUseValue.check.mockResolvedValueOnce(healthCheckResult);
      dbUseValue.pingCheck.mockResolvedValueOnce({ status: 'up' });
      httpUseValue.pingCheck.mockResolvedValueOnce({ status: 'up' });
      appConfigServiceUseValue.isDevelopment = true;

      const result = await controller.check();

      expect(result).toEqual(healthCheckResult);
      const expectedParams = [expect.any(Function), expect.any(Function)];
      expect(service.check).toHaveBeenCalledWith(expectedParams);
    });
  });
});

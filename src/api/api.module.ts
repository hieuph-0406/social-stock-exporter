import { HealthModule } from '@/health/health.module';
import { AppConfigService } from '@/shared/services/app-config.service';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StockExportModule } from './stock-export/stock-export.module';

@Module({
  imports: [SharedModule, ConfigModule, HealthModule, StockExportModule],
  providers: [AppConfigService],
})
export class ApiModule {}

import { HealthModule } from '@/health/health.module';
import { AppConfigService } from '@/shared/services/app-config.service';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RecipeCrawlerModule } from './recipe-crawler/recipe-crawler.module';

@Module({
  imports: [SharedModule, ConfigModule, HealthModule, RecipeCrawlerModule],
  providers: [AppConfigService],
})
export class ApiModule {}

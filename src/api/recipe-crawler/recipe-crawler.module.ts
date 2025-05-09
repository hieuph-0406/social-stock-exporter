import { Module } from '@nestjs/common';
import { RecipeCrawlerController } from './recipe-crawler.controller';
import { RecipeCrawlerService } from './recipe-crawler.service';

@Module({
  controllers: [RecipeCrawlerController],
  providers: [RecipeCrawlerService],
})
export class RecipeCrawlerModule {}

import { CommentEntity } from '@/database/entities/comment.entity';
import { TickerEntity } from '@/database/entities/ticker.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockExportController } from './stock-export.controller';
import { StockExportService } from './stock-export.service';
import { TickerService } from './ticker.service';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, TickerEntity])],
  controllers: [StockExportController],
  providers: [StockExportService, TickerService],
})
export class StockExportModule {}

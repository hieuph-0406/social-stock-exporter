import { CommentEntity } from '@/database/entities/comment.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const VALID_TICKERS = new Set([
  'VCB',
  'FPT',
  'SSI',
  'VHM',
  'HAG',
  'HSG',
  'VNM',
  'MWG',
  'TPB',
  'STB',
  'MBB',
  // ... thêm mã cổ phiếu thật tại đây hoặc load từ DB nếu cần
]);

@Injectable()
export class StockExportService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
  ) {}

  async extractStockSymbols(): Promise<{ symbol: string; count: number }[]> {
    const frequencyMap: Map<string, number> = new Map();
    const comments = await this.commentRepository.find();

    for (const { content } of comments) {
      const tickers = content.match(/\b[A-Z]{3,5}\b/g);
      if (!tickers) continue;

      const countedThisLine = new Set<string>();

      for (const ticker of tickers) {
        if (VALID_TICKERS.has(ticker)) {
          if (!countedThisLine.has(ticker)) {
            frequencyMap.set(ticker, (frequencyMap.get(ticker) || 0) + 1);
            countedThisLine.add(ticker);
          }
        }
      }
    }

    return [...frequencyMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([symbol, count]) => ({ symbol, count }));
  }
}

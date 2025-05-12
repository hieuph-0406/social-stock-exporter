import { Controller, Get } from '@nestjs/common';
import { StockExportService } from './stock-export.service';
import { TickerService } from './ticker.service';

@Controller('stock-export')
export class StockExportController {
  constructor(
    private readonly stockExportService: StockExportService,
    private readonly tickerService: TickerService,
  ) {}

  @Get('hot-stocks')
  async getHotStockSymbols() {
    return this.stockExportService.extractStockSymbolsFromFile();
  }
}

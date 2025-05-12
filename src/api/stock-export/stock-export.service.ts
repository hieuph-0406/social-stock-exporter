import { Injectable } from '@nestjs/common';
import csvParser from 'csv-parser';
import fs from 'fs';
import path from 'path';
@Injectable()
export class StockExportService {
  async extractStockSymbolsFromFile(): Promise<
    { symbol: string; count: number }[]
  > {
    const dataDir = path.join(__dirname, 'data');
    console.log('Data directory:', dataDir);
    const tickerFile = path.join(dataDir, 'tickers.csv');
    const postFile = path.join(dataDir, 'ticker-x-posts.csv');

    const VALID_TICKERS = new Set(
      (await this.readCSVColumn(tickerFile, 'ticker')).map((t) =>
        t.toUpperCase(),
      ),
    );
    const posts = await this.readCSVColumn(postFile, 'Post detail');
    const frequencyMap: Map<string, number> = new Map();

    for (const content of posts) {
      const tickers = content.match(/\b[A-Z]{3,5}\b/g);
      if (!tickers) continue;

      const countedThisLine = new Set<string>();
      for (const ticker of tickers) {
        if (VALID_TICKERS.has(ticker) && !countedThisLine.has(ticker)) {
          frequencyMap.set(ticker, (frequencyMap.get(ticker) || 0) + 1);
          countedThisLine.add(ticker);
        }
      }
    }

    return [...frequencyMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([symbol, count]) => ({ symbol, count }));
  }

  private async readCSVColumn(
    filePath: string,
    columnName: string,
  ): Promise<string[]> {
    const results: string[] = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          if (row[columnName]) {
            results.push(row[columnName].trim());
          }
        })
        .on('end', () => resolve(results))
        .on('error', reject);
    });
  }
}

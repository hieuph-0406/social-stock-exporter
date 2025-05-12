// src/ticker/ticker.service.ts
import { TickerEntity } from '@/database/entities/ticker.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Repository } from 'typeorm';

@Injectable()
export class TickerService {
  constructor(
    @InjectRepository(TickerEntity)
    private readonly tickerRepo: Repository<TickerEntity>,
  ) {}

  async crawlHOSETickers(): Promise<string[]> {
    const url = 'https://banggia.vietstock.vn/bang-gia/hose';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const tickers = new Set<string>();

    $('table tbody tr').each((_, el) => {
      const code = $(el).find('td').first().text().trim();
      if (/^[A-Z]{3,5}$/.test(code)) {
        tickers.add(code);
      }
    });

    const result = [...tickers];

    console.log('Crawled tickers:', result);
    return result;
  }
}

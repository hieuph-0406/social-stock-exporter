import { Controller, Get } from '@nestjs/common';
import { RecipeCrawlerService } from './recipe-crawler.service';

@Controller('recipes')
export class RecipeCrawlerController {
  constructor(private readonly recipeService: RecipeCrawlerService) {}

  @Get()
  async getRecipes() {
    return this.recipeService.getAllRecipes();
  }

  @Get('crawl')
  async crawlRecipes() {
    return this.recipeService.crawlRecipes();
  }
}

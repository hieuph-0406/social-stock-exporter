import { generateModulesSet } from '@/utilities/modules-set.util';
import { Module } from '@nestjs/common';

@Module({
  imports: generateModulesSet(),
  controllers: [],
  providers: [],
})
export class AppModule {}

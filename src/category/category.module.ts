import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { DatabaseProvider } from '../database/database.provider';
import { CategoryRepo } from './category.repo';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, DatabaseProvider, CategoryRepo],
})
export class CategoryModule {}

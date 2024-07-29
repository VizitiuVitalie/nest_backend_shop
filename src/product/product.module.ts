import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DatabaseProvider } from '../database/database.provider';
import { ProductRepo } from './product.repo';

@Module({
  controllers: [ProductController],
  providers: [ProductService, DatabaseProvider, ProductRepo],
})
export class ProductModule {}

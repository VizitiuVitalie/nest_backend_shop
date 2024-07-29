import { Injectable } from '@nestjs/common';
import { Product } from './product.model';
import { ProductRepo } from './product.repo';

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepo) {}

  async create(product: Product) {
    const createdProduct = await this.productRepo.create(product);
    return createdProduct;
  }

  async findAll() {
    const products = await this.productRepo.findAll();
    return products;
  }

  async updateCategory(productId: string, category: string) {
    const product = await this.productRepo.updateCategory(productId, category);
    return product;
  }
}

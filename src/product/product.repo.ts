import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from '../database/database.provider';
import { Product } from './product.model';

@Injectable()
export class ProductRepo {
  constructor(private readonly db_provider: DatabaseProvider) {}

  async create(product: Product): Promise<Product> {
    try {
      await this.db_provider.query('BEGIN');

      const queryText = `
        INSERT INTO products (name, article, price, quantity, brand, images, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (article) DO UPDATE SET name=$1, article=$2, price=$3, quantity=$4, 
        brand=$5, images=$6, description=$7
        RETURNING id, name, article, price, quantity, brand, images, description;
      `;

      const result = await this.db_provider.query(queryText, [
        product.name,
        product.article,
        product.price,
        product.quantity,
        product.brand,
        product.images,
        product.description,
      ]);

      await this.db_provider.query('COMMIT');

      const createdProduct = result.rows[0];
      return new Product(createdProduct);
    } catch (error) {
      await this.db_provider.query('ROLLBACK');
      throw error;
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      await this.db_provider.query('BEGIN');

      const queryText = `
        SELECT * FROM products
      `;

      const result = await this.db_provider.query(queryText);

      await this.db_provider.query('COMMIT');

      const products = result.rows;
      return products.map((products) => new Product(products));
    } catch (error) {
      await this.db_provider.query('ROLLBACK');
      throw error;
    }
  }

  async updateCategory(productId: string, category: string): Promise<Product> {
    try {
      await this.db_provider.query('BEGIN');

      const queryText = `
        UPDATE products SET 
        category = $2
        WHERE id = $1
        RETURNING id, name, article, price, quantity, brand, images, description, category;
      `;

      const result = await this.db_provider.query(queryText, [
        productId,
        category,
      ]);

      await this.db_provider.query('COMMIT');

      const updatedProduct = result.rows[0];
      return new Product(updatedProduct);
    } catch (error) {
      await this.db_provider.query('ROLLBACK');
      throw error;
    }
  }
}

import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from '../database/database.provider';
import { Category } from './category.model';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryRepo {
  constructor(private readonly db_provider: DatabaseProvider) {}

  async create(category: Category): Promise<Category> {
    try {
      await this.db_provider.query('BEGIN');

      const queryText = `
        INSERT INTO categories (name, description)
        VALUES ($1, $2) 
        RETURNING name, description;
      `;

      const result = await this.db_provider.query(queryText, [
        category.name,
        category.description,
      ]);

      await this.db_provider.query('COMMIT');

      const createdCategory = result.rows[0];
      return new Category(createdCategory);
    } catch (error) {
      await this.db_provider.query('ROLLBACK');
      throw error;
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      await this.db_provider.query('BEGIN');

      const queryText = `
        SELECT * FROM categories;
      `;

      const result = await this.db_provider.query(queryText);

      await this.db_provider.query('COMMIT');

      const categories = result.rows;
      return categories.map((products) => new Category(products));
    } catch (error) {
      await this.db_provider.query('ROLLBACK');
      throw error;
    }
  }

  async update(
    name: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      await this.db_provider.query('BEGIN');

      const queryText = `
        UPDATE categories SET 
        name = COALESCE($2, name),
        description = COALESCE($3, description)
        WHERE name = $1
        RETURNING name, description;
      `;

      const result = await this.db_provider.query(queryText, [
        name,
        updateCategoryDto.name,
        updateCategoryDto.description,
      ]);

      await this.db_provider.query('COMMIT');

      const updatedCategory = result.rows[0];
      return new Category(updatedCategory);
    } catch (error) {
      await this.db_provider.query('ROLLBACK');
      throw error;
    }
  }

  async remove(name: string): Promise<Category> {
    try {
      await this.db_provider.query('BEGIN');

      const queryText = `
        DELETE FROM categories WHERE name = $1
        RETURNING name, description;
      `;

      const result = await this.db_provider.query(queryText, [name]);

      await this.db_provider.query('COMMIT');

      const removedCategory = result.rows[0];
      if (!removedCategory) return;
      return new Category(removedCategory);
    } catch (error) {
      await this.db_provider.query('ROLLBACK');
      throw error;
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepo } from './category.repo';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepo) {}

  async create(categoryInfo: CreateCategoryDto) {
    const createdCategory = await this.categoryRepo.create(categoryInfo);
    return createdCategory;
  }

  async findAll() {
    const categories = await this.categoryRepo.findAll();
    return categories;
  }

  async update(name: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepo.update(name, updateCategoryDto);
    return category;
  }

  async remove(name: string) {
    const removedCategory = await this.categoryRepo.remove(name);
    if (!removedCategory) {
      throw new NotFoundException();
    }
    return removedCategory;
  }
}

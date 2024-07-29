import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() categoryInfo: CreateCategoryDto) {
    try {
      await this.categoryService.create(categoryInfo);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Category successfully uploaded',
      };
    } catch (error) {
      console.error('[CategoryController.create]:', error);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const categories = await this.categoryService.findAll();
      return {
        statusCode: HttpStatus.OK,
        message: 'Categories successfully received',
        data: categories,
      };
    } catch (error) {
      console.error('[CategoryController.create]:', error);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':name')
  async update(
    @Param('name') name: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      await this.categoryService.update(name, updateCategoryDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Categories successfully updated',
      };
    } catch (error) {
      console.error('[CategoryController.update]:', error);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':name')
  async remove(@Param('name') name: string) {
    try {
      await this.categoryService.remove(name);
      return {
        statusCode: HttpStatus.OK,
        message: 'Categories successfully removed',
      };
    } catch (error) {
      console.error('[CategoryController.remove]:', error);
      throw new HttpException(
        {
          status: error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

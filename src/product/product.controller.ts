import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  ParseFilePipeBuilder,
  Patch,
  Param,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { read, utils } from 'xlsx';
import { convertToProducts } from './helpers/utils';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    const workbook = read(file.buffer);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = utils.sheet_to_json(worksheet);
    const products = convertToProducts(data);

    try {
      await Promise.all(
        products.map(async (product) => {
          return await this.productService.create(product);
        }),
      );
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Products successfully uploaded',
      };
    } catch (error) {
      console.error('[ProductController.uploadFile]:', error);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const products = await this.productService.findAll();
      return {
        statusCode: HttpStatus.OK,
        message: 'Products successfully received',
        data: products,
      };
    } catch (error) {
      console.error('[ProductController.findAll]:', error);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':productId/category/:category')
  async updateCategory(
    @Param('productId') productId: string,
    @Param('category') category: string,
  ) {
    try {
      const products = await this.productService.updateCategory(
        productId,
        category,
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Products category successfully updated',
      };
    } catch (error) {
      console.error('[ProductController.findAll]:', error);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

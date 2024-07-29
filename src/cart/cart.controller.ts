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
import { AddCartItemDto } from './dto/add-cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly CartService: CartService) {}

  @Post('create')
  async create(@Body('user_id') user_id: string) {
    try {
      const result = await this.CartService.createCart(user_id);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Cart successfully created',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  
}

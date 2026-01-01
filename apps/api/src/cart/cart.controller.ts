import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Cookies } from '@/common/decorators/cookies.decorators';

import { CartService } from './cart.service';
import { ItemDto, ItemRequestDto } from './dto/cart.dto';

@ApiTags('Cart')
@ApiBearerAuth('Bearer')
@Controller('cart')
export class CartController {
  constructor(
    private readonly cart: CartService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  @Get('')
  @ApiOperation({ summary: 'Get all items in a cart' })
  @ApiOkResponse({
    description: 'Cart items retrieved successfully',
    type: [ItemDto],
  })
  @ApiNotFoundResponse({ description: 'User does not have a cart!?' })
  async getCart(@Cookies('access_token') token: string) {
    const userData = this.jwt.verify(token, {
      secret: this.config.getOrThrow<string>('JWT_SECRET'),
    });
    const userId = userData.sub;
    const cartId = await this.cart.getCartIdfromUserId(userId);
    return this.cart.getAll(cartId);
  }

  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiCreatedResponse({
    description: 'Item added to cart successfully',
    type: ItemDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiConflictResponse({ description: 'Item already exists in cart' })
  async addItem(@Body() item: ItemRequestDto) {
    return this.cart.addItem(item);
  }

  @Put('items/:id')
  @ApiOperation({ summary: 'Update item in cart' })
  @ApiOkResponse({
    description: 'Item updated successfully',
    type: ItemDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Cart item not found' })
  async editItem(@Param('id') id: string, @Body() item: ItemRequestDto) {
    return this.cart.editItem({
      id,
      ...item,
    });
  }

  @Delete('items/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete item from cart' })
  @ApiOkResponse({ description: 'Item deleted successfully' })
  @ApiNotFoundResponse({ description: 'Cart item not found' })
  async deleteItem(@Param('id') id: string) {
    return this.cart.deleteItem({
      id,
    });
  }
}

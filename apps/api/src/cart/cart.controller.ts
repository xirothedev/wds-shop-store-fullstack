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
  UseGuards,
} from '@nestjs/common';
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
import { JwtAuthGuard } from '@/common/guards/jwt.guard';

import { CartService } from './cart.service';
import { ItemDto, ItemRequestDto, QueryResponseDto } from './dto/cart.dto';

@ApiTags('Cart')
@ApiBearerAuth('Bearer')
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cart: CartService) {}

  @Get('')
  @ApiOperation({ summary: 'Get all items in a cart' })
  @ApiOkResponse({
    description: 'Cart items retrieved successfully',
    type: [QueryResponseDto],
  })
  @ApiNotFoundResponse({ description: 'User does not have a cart!?' })
  async getCart(@Cookies('access_token') token: string) {
    const cartId = await this.cart.getCartIdFromToken(token);
    return await this.cart.getAll(cartId);
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
  async addItem(
    @Body() item: ItemRequestDto,
    @Cookies('access_token') token: string
  ) {
    item.cartId = await this.cart.getCartIdFromToken(token);
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
  async editItem(
    @Param('id') id: string,
    @Body() item: ItemRequestDto,
    @Cookies('access_token') token: string
  ) {
    item.cartId = await this.cart.getCartIdFromToken(token);
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
  async deleteItem(
    @Param('id') id: string,
    @Cookies('access_token') token: string
  ) {
    const cartId = await this.cart.getCartIdFromToken(token);
    if (!cartId) {
      throw new Error('No cart provided');
    }
    return this.cart.deleteItem({
      id,
      cartId,
    });
  }
}

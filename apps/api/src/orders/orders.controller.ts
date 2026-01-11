import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../types/express';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersQueryDto } from './dto/orders-query.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create an order from cart items',
  })
  createOrder(
    @Body() dto: CreateOrderDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    console.log(dto);
    return this.ordersService.createOrder(user, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get orders for current user (defaults to paid orders)',
  })
  listOrders(
    @Query() query: OrdersQueryDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.ordersService.listOrders(user, query);
  }

  @Get(':orderId')
  @ApiOperation({
    summary: 'Get order details by ID',
  })
  getOrder(
    @Param('orderId') orderId: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.ordersService.getOrderById(orderId, user);
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Order items',
    type: [CreateOrderItemDto],
  })
  @IsArray({ message: 'items must be an array' })
  @ArrayMinSize(1, { message: 'items must contain at least 1 item' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiProperty({
    description: 'Shipping fee',
    required: false,
    example: 30000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'shippingFee must be a number' })
  @Min(0, { message: 'shippingFee must be at least 0' })
  shippingFee?: number;

  @ApiProperty({
    description: 'Discount value',
    required: false,
    example: 50000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'discountValue must be a number' })
  @Min(0, { message: 'discountValue must be at least 0' })
  discountValue?: number;

  @ApiProperty({
    description: 'Shipping address',
    required: false,
    example: '123 Nguyen Trai, District 1',
  })
  @IsOptional()
  @IsString({ message: 'shippingAddress must be a string' })
  shippingAddress?: string;

  @ApiProperty({
    description: 'Shipping city',
    required: false,
    example: 'Ho Chi Minh',
  })
  @IsOptional()
  @IsString({ message: 'shippingCity must be a string' })
  shippingCity?: string;

  @ApiProperty({
    description: 'Shipping state',
    required: false,
    example: 'HCMC',
  })
  @IsOptional()
  @IsString({ message: 'shippingState must be a string' })
  shippingState?: string;

  @ApiProperty({
    description: 'Shipping zip',
    required: false,
    example: '700000',
  })
  @IsOptional()
  @IsString({ message: 'shippingZip must be a string' })
  shippingZip?: string;

  @ApiProperty({
    description: 'Shipping country',
    required: false,
    example: 'Vietnam',
  })
  @IsOptional()
  @IsString({ message: 'shippingCountry must be a string' })
  shippingCountry?: string;
}

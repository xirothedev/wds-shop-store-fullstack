import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class ItemRequestDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Cart ID',
    example: 'kljasdlfkj290192',
  })
  cartId: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Product ID',
    example: 'kljasdlfkj290192',
  })
  productId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Product size',
    example: '42',
    enum: ['38', '39', '40', '41', '42', '43', '44', '45'],
  })
  size: string;

  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Quantity',
    example: 2,
    minimum: 1,
  })
  quantity: number;
} // For adding, editing cart items

export class ItemDeleteRequestDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Cart item ID',
    example: 'oaisjdfoijasd90128039',
  })
  id: string;
} // For deleting cart items

export class ItemDto {
  id: string;
  cartId: string;
  productId: string;
  size: string;
  quantity: number;
}

export interface QueryDto {
  cartId: string;
}

export interface QueryResponseDto {
  id: string;
  cartId: string;
  productId: string;
  size: string;
  quantity: number;
  stocks: number;
}

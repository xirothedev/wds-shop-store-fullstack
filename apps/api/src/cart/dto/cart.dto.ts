import { ProductGender } from '@generated/prisma';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class ItemRequestDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Cart ID (auto-filled from token)',
    example: 'kljasdlfkj290192',
    required: false,
  })
  cartId?: string;

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

  @IsNotEmpty()
  @ApiProperty({
    description: 'Cart ID',
    example: 'adsfoaidj12309012',
  })
  cartId: string;
} // For deleting cart items

export class ItemDto {
  @ApiProperty({
    description: 'Cart item ID',
    example: 'oaisjdfoijasd90128039',
  })
  id: string;

  @ApiProperty({
    description: 'Cart ID',
    example: 'kljasdlfkj290192',
  })
  cartId: string;

  @ApiProperty({
    description: 'Product ID',
    example: 'kljasdlfkj290192',
  })
  productId: string;

  @ApiProperty({
    description: 'Product size',
    example: '42',
    enum: ['38', '39', '40', '41', '42', '43', '44', '45'],
  })
  size: string;

  @ApiProperty({
    description: 'Quantity',
    example: 2,
  })
  quantity: number;
}

export interface QueryDto {
  cartId: string;
}

export class QueryResponseDto {
  @ApiProperty({
    description: 'Product ID',
    example: 'kljasdlfkj290192',
  })
  id: string;

  @ApiProperty({
    description: 'Product slug',
    example: 'nike-air-max-270',
  })
  slug: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Nike Air Max 270',
  })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'The Nike Air Max 270 delivers...',
  })
  description: string;

  @ApiProperty({
    description: 'Current price',
    example: 2500000,
  })
  priceCurrent: number;

  @ApiProperty({
    description: 'Original price',
    example: 3000000,
    required: false,
  })
  priceOriginal?: number;

  @ApiProperty({
    description: 'Discount amount',
    example: 500000,
    required: false,
  })
  priceDiscount?: number;

  @ApiProperty({
    description: 'Product badge',
    example: 'Limited Edition',
    required: false,
  })
  badge?: string;

  @ApiProperty({
    description: 'Rating value',
    example: 4.5,
  })
  ratingValue: number;

  @ApiProperty({
    description: 'Rating count',
    example: 128,
  })
  ratingCount: number;

  @ApiProperty({
    description: 'Product gender',
    enum: ['MALE', 'FEMALE', 'UNISEX'],
    example: 'UNISEX',
  })
  gender: ProductGender;

  @ApiProperty({
    description: 'Is published',
    example: true,
    required: false,
  })
  isPublished?: boolean;

  @ApiProperty({
    description: 'Created at',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  createdAt?: string;

  @ApiProperty({
    description: 'Updated at',
    example: '2024-01-02T00:00:00.000Z',
    required: false,
  })
  updatedAt?: string;

  @ApiProperty({
    description: 'Product images',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    required: false,
  })
  images?: string[];

  @ApiProperty({
    description: 'Cart ID',
    example: 'adsfoaidj12309012',
    required: false,
  })
  cartId?: string;

  @ApiProperty({
    description: 'Cart item ID',
    example: 'oaisjdfoijasd90128039',
  })
  cartItemId: string;

  @ApiProperty({
    description: 'Quantity in cart',
    example: 2,
  })
  quantity: number;

  @ApiProperty({
    description: 'Product size',
    example: '42',
    enum: ['38', '39', '40', '41', '42', '43', '44', '45'],
  })
  size: string;

  @ApiProperty({
    description: 'Available stock',
    example: 10,
  })
  stock: number;
}

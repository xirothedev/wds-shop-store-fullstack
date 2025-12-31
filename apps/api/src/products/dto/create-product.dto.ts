import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Air Max 90', description: 'Product name' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Classic sneaker',
    description: 'Product description',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 129.99, description: 'Current price' })
  @IsNumber()
  priceCurrent: number;

  @ApiProperty({
    example: 199.99,
    description: 'Original price',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  priceOriginal?: number;

  @ApiProperty({
    example: 70.0,
    description: 'Discount amount',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  priceDiscount?: number;

  @ApiProperty({ example: 'Limited Edition', required: false })
  @IsOptional()
  @IsString()
  badge?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiProperty({
    example: 'UNISEX',
    enum: ['MALE', 'FEMALE', 'UNISEX'],
    required: false,
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({
    example: ['https://example.com/image1.jpg'],
    description: 'Array of image URLs',
    required: false,
    type: 'array',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({
    example: [{ size: 'M', stock: 10 }],
    description: 'Optional size stock records',
    required: false,
    type: 'array',
  })
  @IsOptional()
  sizeStocks?: { size: string; stock: number }[];
}

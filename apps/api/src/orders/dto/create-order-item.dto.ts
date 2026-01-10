import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'Product ID',
    example: 'c0f0f3c5-6c5b-4f31-9f0d-4b8d2c8a0e2a',
  })
  @IsUUID('4', { message: 'productId must be a valid UUID' })
  productId: string;

  @ApiProperty({
    description: 'Product size',
    example: 'M',
  })
  @IsString({ message: 'size must be a string' })
  @IsNotEmpty({ message: 'size is required' })
  size: string;

  @ApiProperty({
    description: 'Quantity',
    example: 2,
  })
  @IsInt({ message: 'quantity must be an integer' })
  @Min(1, { message: 'quantity must be at least 1' })
  quantity: number;
}

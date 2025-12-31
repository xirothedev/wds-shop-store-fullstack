import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
    @ApiProperty({ example: 'ckxyz...', description: 'Product id' })
    id: string;

    @ApiProperty({ example: 'air-max-90', description: 'Unique product slug' })
    slug: string;

    @ApiProperty({ example: 'Air Max 90', description: 'Product name' })
    name: string;

    @ApiProperty({
        example: 'Classic sneaker',
        description: 'Product description'
    })
    description: string;

    @ApiProperty({ example: 129.99, description: 'Current price' })
    priceCurrent: number;

    @ApiProperty({
        example: 199.99,
        description: 'Original price',
        required: false
    })
    priceOriginal?: number;

    @ApiProperty({
        example: 70.0,
        description: 'Discount amount',
        required: false
    })
    priceDiscount?: number;

    @ApiProperty({ example: 'Limited Edition', required: false })
    badge?: string;

    @ApiProperty({ example: 4.5, required: false })
    ratingValue?: number;

    @ApiProperty({ example: 120, required: false })
    ratingCount?: number;

    @ApiProperty({
        example: 'UNISEX',
        enum: ['MALE', 'FEMALE', 'UNISEX'],
        required: false
    })
    gender?: string;

    @ApiProperty({ example: true })
    isPublished: boolean;

    @ApiProperty({ example: '2025-12-31T00:00:00.000Z' })
    createdAt: string;

    @ApiProperty({ example: '2025-12-31T00:00:00.000Z' })
    updatedAt: string;
}

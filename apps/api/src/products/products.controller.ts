import { UserRole } from '@generated/prisma';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '@/common/decorators/public.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/roles.guard';

import { CreateProductDto } from './dto/create-product.dto';
import { ProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('/api/products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {
        console.log('>>> ProductsController INITIALIZED');
    }

    @Public()
    @Get('suggestions')
    @ApiOperation({ summary: 'Get search suggestions' })
    @ApiQuery({
        name: 'gender',
        required: false,
        description: 'Filter by gender (MALE, FEMALE, UNISEX)',
        enum: ['MALE', 'FEMALE', 'UNISEX']
    })
    @ApiQuery({
        name: 'isSale',
        required: false,
        description: 'Filter products on sale (true/false)',
        type: Boolean,
        example: false
    })
    @ApiQuery({
        name: 'q',
        required: false,
        description: 'Search term',
        type: String
    })
    @ApiResponse({
        status: 200,
        description: 'List of suggestions'
    })
    async getSuggestions(
        @Query('gender') gender?: string,
        @Query('isSale') isSale?: string,
        @Query('q') q?: string
    ) {
        return this.productsService.getSearchSuggestions(
            q || '',
            gender,
            isSale
        );
    }

    //create product
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async create(@Body() createProductDto: CreateProductDto) {
        const result = await this.productsService.create(createProductDto);
        return result;
    }

    //get products
    @Public()
    @Get()
    @ApiOperation({ summary: 'Get all products' })
    @ApiQuery({
        name: 'gender',
        required: false,
        description: 'Filter by gender (MALE, FEMALE, UNISEX)',
        enum: ['MALE', 'FEMALE', 'UNISEX']
    })
    @ApiQuery({
        name: 'isSale',
        required: false,
        description: 'Filter products on sale (true/false)',
        type: Boolean,
        example: false
    })
    @ApiResponse({
        status: 200,
        description: 'List products',
        type: [ProductDto]
    })
    async findAll(
        @Query('gender') gender?: string,
        @Query('isSale') isSale?: string
    ) {
        return this.productsService.findAll(gender, isSale);
    }

    //search products

    @Public()
    @Get('search')
    @ApiOperation({ summary: 'Search products by name or description' })
    @ApiResponse({
        status: 200,
        description: 'Search results',
        type: [ProductDto]
    })
    @ApiQuery({
        name: 'gender',
        required: false,
        description: 'Filter by gender (MALE, FEMALE, UNISEX)',
        enum: ['MALE', 'FEMALE', 'UNISEX']
    })
    @ApiQuery({
        name: 'isSale',
        required: false,
        description: 'Filter products on sale (true/false)',
        type: Boolean,
        example: false
    })
    @ApiQuery({
        name: 'q',
        required: false,
        description: 'Search term',
        type: String,
        example: 'shirt'
    })
    async search(
        @Query('gender') gender?: string,
        @Query('isSale') isSale?: string,
        @Query('q') q?: string
    ) {
        return this.productsService.searchProductsWithRelevance(
            q || '',
            gender,
            isSale
        );
    }
    //get product by slug
    @Public()
    @Get('slug/:slug')
    @ApiResponse({ status: 200, description: 'Get product', type: ProductDto })
    findOneBySlug(@Param('slug') slug: string) {
        return this.productsService.findOneBySlug(slug);
    }
    //get related products
    @Public()
    @Get('related/:slug')
    @ApiResponse({
        status: 200,
        description: 'Get related products',
        type: [ProductDto]
    })
    getRelatedProducts(@Param('slug') slug: string) {
        return this.productsService.getRelatedProducts(slug);
    }
    //get product by id
    @Public()
    @Get(':id')
    @ApiResponse({ status: 200, description: 'Get product', type: ProductDto })
    findOne(@Param('id') id: string) {
        console.log('>>> findOne CALLED with id:', id);
        return this.productsService.findOne(id);
    }
    @Patch(':id')
    @Public()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Update product' })
    @ApiResponse({
        status: 200,
        description: 'Product updated successfully',
        type: ProductDto
    })
    update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto
    ) {
        return this.productsService.update(id, updateProductDto);
    }

    //delete product
    @Delete(':id')
    @Public()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete product' })
    @ApiResponse({
        status: 200,
        description: 'Product deleted successfully'
    })
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}

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
  UseGuards,
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
    name: 'q',
    required: false,
    description: 'Search term',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'List of suggestions',
  })
  async getSuggestions(@Query('q') q?: string) {
    return this.productsService.getSearchSuggestions(q || '');
  }

  //create product
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createProductDto: CreateProductDto) {
    const result = await this.productsService.create(createProductDto);
    return result;
  }

  //get all products
  @Public()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'List products',
    type: [ProductDto],
  })
  async findAll() {
    return this.productsService.findAll();
  }

  //search products

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Search products by name or description' })
  @ApiResponse({
    status: 200,
    description: 'Search results',
    type: [ProductDto],
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search term',
    type: String,
    example: 'shirt',
  })
  async search(@Query('q') q?: string) {
    return this.productsService.searchProductsWithRelevance(q || '');
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
    type: ProductDto,
  })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
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
    description: 'Product deleted successfully',
  })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}

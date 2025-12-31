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
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createProductDto: CreateProductDto) {
    const result = await this.productsService.create(createProductDto);
    return result;
  }
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

  @Public()
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get product', type: ProductDto })
  findOne(@Param('id') id: string) {
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

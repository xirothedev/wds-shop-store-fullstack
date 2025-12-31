import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDto } from './dto/product.dto';
import { Public } from '@/common/decorators/public.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@generated/prisma';

@ApiTags('Products')
@Controller('/api/products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles(UserRole.ADMIN)
    async create(@Body() createProductDto: CreateProductDto) {
        const result = await this.productsService.create(createProductDto);
        return result;
    }
    @Public()
    @Get()
    @ApiResponse({
        status: 200,
        description: 'List products',
        type: [ProductDto]
    })
    async findAll() {
        const data = await this.productsService.findAll();
        return {
            success: true,
            message: 'Get products successfully',
            data
        };
    }
    @Public()
    @Get(':id')
    @ApiResponse({ status: 200, description: 'Get product', type: ProductDto })
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }
    @Patch(':id')
    @Public()
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles(UserRole.ADMIN)
    update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto
    ) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    @Public()
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}

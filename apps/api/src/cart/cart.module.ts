import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from '@/prisma/prisma.module';

import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartModule],
})
export class CartModule {}

import { ConflictException, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ItemDto, ItemRequestDto } from '@/cart/dto/cart.dto';
import { PrismaService } from '@/prisma/prisma.service';

import { AddItemCommand } from './add-item.command';

@Injectable()
@CommandHandler(AddItemCommand)
export class AddItemCommandHandler implements ICommandHandler<
  AddItemCommand,
  ItemDto
> {
  constructor(private prisma: PrismaService) {}

  async execute(command: AddItemCommand): Promise<ItemDto> {
    const item: ItemRequestDto = command.item;

    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        ...item,
      },
    });

    if (existingItem) {
      throw new ConflictException(`The Cart already have this item`);
    }

    const newItem = await this.prisma.cartItem.create({
      data: {
        ...item,
      },
    });

    return newItem;
  }
}

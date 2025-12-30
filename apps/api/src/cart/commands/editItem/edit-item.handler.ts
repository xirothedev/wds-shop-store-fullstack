import { ConflictException, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ItemDto } from '@/cart/dto/cart.dto';
import { PrismaService } from '@/prisma/prisma.service';

import { EditItemCommand } from './edit-item.command';

@Injectable()
@CommandHandler(EditItemCommand)
export class EditItemCommandHandler implements ICommandHandler<
  EditItemCommand,
  ItemDto
> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: EditItemCommand): Promise<ItemDto> {
    const item = command.item;

    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        id: item.id,
      },
    });

    if (!existingItem) {
      throw new ConflictException('Cart Item does not exists!');
    }

    const newItem = await this.prisma.cartItem.update({
      where: {
        id: item.id,
      },

      data: {
        size: item.size,
        quantity: item.quantity,
      },
    });

    return newItem;
  }
}

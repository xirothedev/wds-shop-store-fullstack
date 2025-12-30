import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ItemDeleteRequestDto } from '@/cart/dto/cart.dto';
import { PrismaService } from '@/prisma/prisma.service';

import { DeleteItemCommand } from './delete-item.command';

@Injectable()
@CommandHandler(DeleteItemCommand)
export class DeleteItemCommandHandler implements ICommandHandler<
  DeleteItemCommand,
  void
> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: DeleteItemCommand): Promise<void> {
    const item: ItemDeleteRequestDto = command.item;

    try {
      await this.prisma.cartItem.delete({
        where: {
          id: item.id,
        },
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}

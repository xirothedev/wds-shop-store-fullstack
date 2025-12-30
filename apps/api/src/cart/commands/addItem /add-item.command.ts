import { Injectable } from '@nestjs/common';
import { Command } from '@nestjs/cqrs';

import { ItemDto, type ItemRequestDto } from '@/cart/dto/cart.dto';

@Injectable()
export class AddItemCommand extends Command<ItemDto> {
  constructor(public readonly item: ItemRequestDto) {
    super();
  }
}

import { Injectable } from '@nestjs/common';
import { Command } from '@nestjs/cqrs';

import { type ItemDeleteRequestDto } from '@/cart/dto/cart.dto';

@Injectable()
export class DeleteItemCommand extends Command<void> {
  constructor(public readonly item: ItemDeleteRequestDto) {
    super();
  }
}

import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';

import { AddItemCommandHandler } from './commands/addItem /add-item.handler';
import { DeleteItemCommandHandler } from './commands/deleteItem/delete-item.handler';
import { EditItemCommandHandler } from './commands/editItem/edit-item.handler';

const Handlers = [
  AddItemCommandHandler,
  DeleteItemCommandHandler,
  EditItemCommandHandler,
];

@Module({
  imports: [PrismaModule],
  providers: [...Handlers],
  exports: [CartModule],
})
export class CartModule {}

import { PaymentTransactionStatus } from '@generated/prisma';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePaymentStatusDto {
  @ApiProperty({
    description:
      'Unique transaction code returned when the payment was initiated',
    example: 'PAY-7F2K3M1Q',
  })
  @IsString({ message: 'transactionCode must be a string' })
  @IsNotEmpty({ message: 'transactionCode is required' })
  transactionCode: string;

  @ApiProperty({
    description: 'Latest status of the payment transaction',
    enum: PaymentTransactionStatus,
    example: PaymentTransactionStatus.PAID,
  })
  @IsEnum(PaymentTransactionStatus, {
    message: 'status must be a valid PaymentTransactionStatus',
  })
  status: PaymentTransactionStatus;

  @ApiProperty({
    description:
      'Optional payload returned by the payment provider (stored as JSON)',
    required: false,
    example: { provider: 'mock', referenceId: 'abc123' },
  })
  @IsOptional()
  @IsObject({ message: 'payload must be an object' })
  payload?: Record<string, unknown>;
}

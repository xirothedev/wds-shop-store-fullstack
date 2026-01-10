import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class InitiatePaymentDto {
  @ApiProperty({
    description:
      'Optional return URL that the mock payment page should redirect to after completion',
    required: false,
    example: 'http://localhost:3000/payment-result',
  })
  @IsOptional()
  @IsString({ message: 'returnUrl must be a string' })
  @IsUrl({ require_tld: false }, { message: 'returnUrl must be a valid URL' })
  returnUrl?: string;
}

import {
  Controller,
  Get,
  Post,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CapsulePaymentsService } from './capsule-payment.service';
import { CapsulePayment } from './entities/capsule-payment.entity';

@ApiTags('Capsule Payments')
@Controller('capsules/payments')
export class CapsulePaymentsController {
  constructor(
    private readonly paymentsService: CapsulePaymentsService,
  ) {}

  @Post(':capsuleId')
  @ApiOperation({ summary: 'Generate payment details for a capsule' })
  @ApiResponse({
    status: 201,
    type: CapsulePayment,
  })
  async create(
    @Param('capsuleId') capsuleId: string,
  ): Promise<CapsulePayment> {
    return this.paymentsService.createPayment(capsuleId);
  }

  @Get(':capsuleId/verify')
  @ApiOperation({ summary: 'Verify on-chain payment for a capsule' })
  @ApiResponse({
    status: 200,
  })
  async verify(
    @Param('capsuleId') capsuleId: string,
  ): Promise<{ verified: boolean; transactionHash?: string }> {
    return this.paymentsService.verifyCapsulePayment(capsuleId);
  }
}

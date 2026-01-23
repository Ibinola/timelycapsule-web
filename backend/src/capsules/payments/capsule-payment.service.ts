import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CapsulePayment } from './entities/capsule-payment.entity';
import { StellarService } from './stellar.service';

@Injectable()
export class CapsulePaymentsService {
  constructor(
    @InjectRepository(CapsulePayment)
    private readonly paymentRepo: Repository<CapsulePayment>,
    private readonly stellarService: StellarService,
  ) {}

  async createPayment(capsuleId: string) {
    const existing = await this.paymentRepo.findOneBy({
      capsuleId,
    });

    if (existing) return existing;

    const details =
      this.stellarService.getPaymentDetails(capsuleId);

    if (!details.address) {
      throw new Error(
        'Stellar payment public key (STELLAR_PAYMENT_PUBLIC_KEY) is not configured in environment variables.',
      );
    }

    const payment = this.paymentRepo.create({
      capsuleId,
      paymentAddress: details.address,
      memo: capsuleId,
    });

    return this.paymentRepo.save(payment);
  }

  async verifyCapsulePayment(capsuleId: string) {
    const payment = await this.paymentRepo.findOneBy({
      capsuleId,
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const result = await this.stellarService.verifyPayment(
      capsuleId,
      payment.paymentAddress,
    );

    if (!result) {
      return { verified: false };
    }

    payment.transactionHash = result.txHash;
    payment.verified = true;

    await this.paymentRepo.save(payment);

    return {
      verified: true,
      transactionHash: result.txHash,
    };
  }
}

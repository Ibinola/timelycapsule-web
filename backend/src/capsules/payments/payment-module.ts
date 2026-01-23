import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CapsulePaymentsController } from "./capsule-payment.controller";
import { CapsulePaymentsService } from "./capsule-payment.service";
import { CapsulePayment } from "./entities/capsule-payment.entity";
import { StellarService } from "./stellar.service";

@Module({
  imports: [TypeOrmModule.forFeature([CapsulePayment])],
  controllers: [CapsulePaymentsController],
  providers: [CapsulePaymentsService, StellarService],
})
export class PaymentsModule {}

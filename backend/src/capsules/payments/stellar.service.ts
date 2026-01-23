import { Injectable, Logger } from '@nestjs/common';
import { Server, Memo } from 'stellar-sdk';

@Injectable()
export class StellarService {
  private server: Server;

  constructor() {
    this.server = new Server(process.env.STELLAR_HORIZON || 'https://horizon-testnet.stellar.org');
  }

  getPaymentDetails(capsuleId: string) {
    return {
      address: process.env.STELLAR_PAYMENT_PUBLIC_KEY,
      memo: capsuleId,
      network: process.env.STELLAR_NETWORK,
      asset: process.env.STELLAR_ASSET_CODE,
    };
  }

  async verifyPayment(
    capsuleId: string,
    destination: string,
  ): Promise<{ txHash: string } | null> {
    const transactions = await this.server
      .transactions()
      .forAccount(destination)
      .order('desc')
      .limit(20)
      .call();

      for (const tx of transactions.records) {
        if (
          tx.memo === capsuleId &&
          tx.memo_type === 'text' &&
          (tx as any).successful !== false
        ) {
          // Verify the transaction actually contains a valid payment operation
          const operations = await tx.operations();
          const validPayment = operations.records.some((op: any) => {
            return (
              op.type === 'payment' &&
              op.to === destination &&
              // Check for Native XLM or specific Asset Code
              ((!process.env.STELLAR_ASSET_CODE || process.env.STELLAR_ASSET_CODE === 'XLM')
                ? op.asset_type === 'native'
                : op.asset_code === process.env.STELLAR_ASSET_CODE)
            );
          });

          if (validPayment) {
            return { txHash: tx.hash };
          }
        }
      }


    return null;
  }
}

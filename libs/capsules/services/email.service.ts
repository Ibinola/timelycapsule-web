import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  /**
   * Send a templated email. This is a lightweight stub — replace with real provider logic.
   */
  async sendTemplateEmail(
    to: string,
    subject: string,
    template: string,
    data: any,
  ): Promise<void> {
    this.logger.debug(
      `sendTemplateEmail to=${to} subject=${subject} template=${template}`,
    );
    // TODO: integrate with an email provider (SendGrid, SES, etc.)
    return Promise.resolve();
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { EmailService } from './email.service';
import { PushNotificationService } from './push-notification.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private emailService: EmailService,
    private pushNotificationService: PushNotificationService,
  ) {}

  async createInAppNotification(userId: string, data: any): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId,
      type: data.type,
      title: data.title,
      message: data.message,
      data: data,
      read: false,
    });

    return this.notificationRepository.save(notification);
  }

  async sendEmail(emailData: {
    to: string;
    subject: string;
    template: string;
    data: any;
  }): Promise<boolean> {
    try {
      await this.emailService.sendTemplateEmail(
        emailData.to,
        emailData.subject,
        emailData.template,
        emailData.data
      );
      return true;
    } catch (error) {
      this.logger.error('Failed to send email:', error);
      return false;
    }
  }

  async sendPushNotification(pushData: {
    token: string;
    title: string;
    body: string;
    data?: any;
  }): Promise<boolean> {
    try {
      await this.pushNotificationService.send(
        pushData.token,
        pushData.title,
        pushData.body,
        pushData.data
      );
      return true;
    } catch (error) {
      this.logger.error('Failed to send push notification:', error);
      return false;
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    await this.notificationRepository.update(
      { id: notificationId },
      { read: true, readAt: new Date() }
    );
  }
}
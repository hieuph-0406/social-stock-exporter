import { AppConfigService } from '@/shared/services/app-config.service';
import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '@sendgrid/mail';
import fs from 'fs';
import Handlebars from 'handlebars';
import { join } from 'path';

@Injectable()
export class MailerService extends MailService {
  private readonly logger = new Logger(MailerService.name);

  constructor(private readonly configService: AppConfigService) {
    super();
    this.setApiKey(configService.appConfig.mailer.sendGridApiKey);
  }

  async sendMail(
    email: string | string[],
    type: Record<string, string>,
    data?: any,
    from?: string,
  ) {
    try {
      const templateData = this.mapDataToTemplate(type?.template, data);

      const mailData = {
        to: email,
        subject: type?.subject,
        html: templateData,
        from: from || this.configService.appConfig.mailer.mailFrom,
      };
      await this.send(mailData);
    } catch (error) {
      this.logger.warn(`Send mail to ${email} failed.`);
    }
  }

  mapDataToTemplate(templateName: string, data?: any): string {
    const html = fs.readFileSync(
      join(__dirname, `../../resources/templates/mail/${templateName}.hbs`),
      'utf-8',
    );

    return Handlebars.compile(html)({
      ...data,
    });
  }
}

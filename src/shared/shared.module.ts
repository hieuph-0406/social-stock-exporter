import { AppConfigService } from '@/shared/services/app-config.service';
import { Global, Module, Provider } from '@nestjs/common';
import { MailService } from '@sendgrid/mail';

const providers: Provider[] = [AppConfigService, MailService];

@Global()
@Module({
  providers,
  imports: [],
  exports: [...providers],
})
export class SharedModule {}

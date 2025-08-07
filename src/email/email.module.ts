import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: "sandbox.smtp.mailtrap.io",
          port: 2525,
          secure: false, // Mailtrap uses false
          auth: {
            user: "e3f8f4abca8725",
            pass: "294e8890d9a242",
          },
        },
        defaults: {
          from: "Auction App",
        },
        template: {
          dir: process.cwd() + '/template',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
            cache: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService]
})
export class EmailModule {}


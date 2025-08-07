import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { MailService } from 'src/email/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
imports: [
    UserModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '5h' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([MailService]),
    ConfigModule,
  ],
  controllers: [AuthController],
  //  providers: [AuthService, AuthGuard],
  providers: [
    AuthService,
    MailService,
    AuthGuard,
  {
    provide: APP_GUARD,
    useClass: AuthGuard,
  }
],
  exports: [AuthGuard], 
})
export class AuthModule {}

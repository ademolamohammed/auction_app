import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { MailService } from 'src/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([User,MailService])],
  controllers: [UserController],
  providers: [UserService,MailService],
  exports: [TypeOrmModule,UserService]
})
export class UserModule {}

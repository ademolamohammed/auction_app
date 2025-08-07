import { Product } from 'src/product/entities/product.entity';
import { Bid } from 'src/bid/entities/bid.entity';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/email/email.module';
import { Module } from '@nestjs/common';
import { AuctionSchedulerService } from './auction-scheduler.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Bid, User]),
    EmailModule,
  ],
  providers: [
    AuctionSchedulerService,
  ],
})
export class AuctionModule {}
// src/bid/bid.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { Bid } from './entities/bid.entity';
import { Product } from '../product/entities/product.entity'; // Import Product entity
import { User } from 'src/user/entities/user.entity';
import { MailService } from 'src/email/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bid, Product,User]), // Include both Bid and Product entities
  ],
  controllers: [BidController],
  providers: [BidService,MailService],
  exports: [BidService], // Export service so other modules can use it
})
export class BidModule {}
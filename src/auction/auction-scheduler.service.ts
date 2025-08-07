import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { Bid } from '../bid/entities/bid.entity';
import { User } from '../user/entities/user.entity';
import { MailService } from '../email/email.service';

@Injectable()
export class AuctionSchedulerService {
  private readonly logger = new Logger(AuctionSchedulerService.name);

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Bid)
    private bidRepository: Repository<Bid>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailService: MailService,
  ) {}

  // Run every 5 minutes to check for ended auctions
  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkEndedAuctions() {
    this.logger.log('Checking for ended auctions...');

    try {
      // Find all products where auction has ended but notifications haven't been sent
      const allProducts = await this.productRepository.find({
        where: {
          isNotificationSent: false,
        },
        relations: ['bids', 'bids.bidder'],
      });

      const endedAuctions = allProducts.filter(product => 
        this.getLocalDateTime() >= this.formatUTCToLocalString(product.endTime)
      );

      this.logger.log(`Found ${endedAuctions.length} ended auctions to process`);

      for (const auction of endedAuctions) {
        await this.processEndedAuction(auction);
      }
    } catch (error) {
      this.logger.error('Error checking ended auctions:', error);
    }
  }

  private async processEndedAuction(auction: Product) {
    try {
      this.logger.log(`Processing ended auction: ${auction.name}`);

      if (auction.bids && auction.bids.length > 0) {
        const winningBid = auction.bids.reduce((prev, current) => 
          (prev.amount > current.amount) ? prev : current
        );

        await this.sendWinnerNotification(auction, winningBid);
        
        this.logger.log(`Winner notification sent for auction: ${auction.name}`);
      } else {
        this.logger.log(`No bids found for auction: ${auction.name}`);
      }

      await this.productRepository.update(auction.id, {
        isNotificationSent: true,
      });

      this.logger.log(`Successfully processed auction: ${auction.name}`);
    } catch (error) {
      this.logger.error(`Error processing auction ${auction.id}:`, error);
    }
  }

  private async sendWinnerNotification(auction: Product, winningBid: Bid) {
    try {
      await this.mailService.sendAuctionWinNotification(
        winningBid.bidder.email,           
        winningBid.bidder.firstName,       
        auction.name,                      
        winningBid.amount,                 
        auction.endTime,                   
        winningBid.bidder.email
      );
      
      this.logger.log(`Winner notification sent to ${winningBid.bidder.email} for auction: ${auction.name}`);
    } catch (error) {
      this.logger.error('Error sending winner notification:', error);
      throw error; // Re-throw to handle in processEndedAuction
    }
  }

  // Use your exact time comparison methods
  private getLocalDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  private formatUTCToLocalString(input: any): string {
    let dateString: string;
    
    // Handle different input types
    if (typeof input === 'string') {
      dateString = input;
    } else if (input instanceof Date) {
      dateString = input.toISOString();
    } else {
      dateString = new Date(input).toISOString();
    }
    
    // Convert "2025-08-03T20:45:00.000Z" to "2025-08-03 20:45:00"
    return dateString.replace('T', ' ').replace('.000Z', '');
  }

  // Manual trigger for testing
  async processEndedAuctionsManually() {
    this.logger.log('Manually processing ended auctions...');
    await this.checkEndedAuctions();
    return { message: 'Ended auctions processed successfully' };
  }
}
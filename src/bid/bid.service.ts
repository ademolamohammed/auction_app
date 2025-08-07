// src/bid/bid.service.ts
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bid } from './entities/bid.entity';
import { Product } from '../product/entities/product.entity';
import { BidResponseDto, CreateBidDto, ProductBidderDto, ProductBidsResponseDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { User } from 'src/user/entities/user.entity';
import { MailService } from 'src/email/email.service';

@Injectable()
export class BidService {
  constructor(
    @InjectRepository(Bid)
    private bidRepository: Repository<Bid>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
     @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailService: MailService
  ) {}

    async create(createBidDto: CreateBidDto): Promise<BidResponseDto> {
    const { productId, amount, userId } = createBidDto;

    // Check if product exists and is active
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['bids'],
    });



    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Check if auction is still active


    if (this.getLocalDateTime() >= this.formatUTCToLocalString(product.endTime)) {
      console.log(this.getLocalDateTime(),this.formatUTCToLocalString(product.endTime));
      throw new BadRequestException('Auction has ended');
    }


    // Check if user exists
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Get current highest bid
    const currentHighestBid = await this.getCurrentHighestBid(productId);
    const minimumBid = currentHighestBid > product.startingPrice ? currentHighestBid : product.startingPrice;

    if (amount <= minimumBid) {
      throw new BadRequestException(
        `Bid must be higher than the current highest bid of ${this.formatCurrency(minimumBid)}`
      );
    }

    // Create and save bid
    const bid = this.bidRepository.create({
      amount,
      productId,
      bidderId: userId,
    });

    const savedBid = await this.bidRepository.save(bid);
    console.log('Saved bid:', savedBid);

    const bidWithRelations = await this.bidRepository.findOne({
      where: { id: savedBid.id },
      relations: ['product', 'bidder'],
    });

    console.log('Bid with relations:', bidWithRelations);

    if (!bidWithRelations) {
      throw new BadRequestException('Failed to retrieve saved bid');
    }

      try {
        await this.mailService.sendBidConfirmation(bidWithRelations.bidder.email,bidWithRelations.bidder.firstName,bidWithRelations.product.name,bidWithRelations.amount,bidWithRelations.product.endTime,bidWithRelations.bidder.email);
        console.log("Test email sent successfully");
      } catch (error) {
        console.error("Email failed:", error);
    }

    

    // Return formatted response
    return this.formatBidResponse(bidWithRelations);
  }


  async findAll(): Promise<BidResponseDto[]> {
    const bids = await this.bidRepository.find({
      relations: ['product', 'bidder'],
      order: { createdAt: 'DESC' },
    });

    return bids.map(bid => this.formatBidResponse(bid));
  }

  async findOne(id: string): Promise<BidResponseDto> {
    const bid = await this.bidRepository.findOne({
      where: { id },
      relations: ['product', 'bidder'],
    });

    if (!bid) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
    }

    return this.formatBidResponse(bid);
  }

  async findByProduct(productId: string): Promise<ProductBidsResponseDto> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const bids = await this.bidRepository.find({
      where: { productId },
      relations: ['bidder'],
      order: { amount: 'DESC', createdAt: 'DESC' },
    });

    const currentHighestBid = bids.length > 0 ? bids[0].amount : product.startingPrice;

    return {
      productId,
      productName: product.name,
      currentHighestBid: this.formatCurrency(currentHighestBid),
      totalBids: bids.length,
      bidders: bids.map(bid => ({
        name: bid.bidder.firstName || `User ${bid.bidder.id}`,
        amount: this.formatCurrency(bid.amount),
        dateTime: this.formatRelativeTime(bid.createdAt),
      })),
    };
  }

  async findByUser(userId: string): Promise<BidResponseDto[]> {
    const bids = await this.bidRepository.find({
      where: { bidderId: userId },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });

    return bids.map(bid => this.formatBidResponse(bid));
  }

  async getCurrentHighestBid(productId: string): Promise<number> {
    const result = await this.bidRepository
      .createQueryBuilder('bid')
      .select('MAX(bid.amount)', 'maxAmount')
      .where('bid.productId = :productId', { productId })
      .getRawOne();

    return result.maxAmount || 0;
  }

  async getProductBidders(productId: string, limit: number = 10): Promise<ProductBidderDto[]> {
    const bids = await this.bidRepository.find({
      where: { productId },
      relations: ['bidder'],
      order: { amount: 'DESC', createdAt: 'DESC' },
      take: limit,
    });

    return bids.map(bid => ({
      name: bid.bidder.firstName || `User ${bid.bidder.id}`,
      amount: this.formatCurrency(bid.amount),
      dateTime: this.formatRelativeTime(bid.createdAt),
    }));
  }

  async update(id: string, updateBidDto: UpdateBidDto, userId: string): Promise<BidResponseDto> {
    const bid = await this.bidRepository.findOne({
      where: { id },
      relations: ['bidder'],
    });

    if (!bid) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
    }

    if (bid.bidderId !== userId) {
      throw new ForbiddenException('You can only update your own bids');
    }

    // Typically, bids shouldn't be updated once placed
    // This is here for completeness but consider removing in production
    throw new BadRequestException('Bids cannot be modified once placed');
  }

  async remove(id: string, userId: string): Promise<void> {
    const bid = await this.bidRepository.findOne({
      where: { id },
    });

    if (!bid) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
    }

    if (bid.bidderId !== userId) {
      throw new ForbiddenException('You can only remove your own bids');
    }

    // Typically, bids shouldn't be removed once placed
    // This is here for completeness but consider removing in production
    throw new BadRequestException('Bids cannot be removed once placed');
  }

  async getWonAuctions(userId: string): Promise<any> {
  // Get user details
  const user = await this.userRepository.findOne({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundException(`User with ID ${userId} not found`);
  }

  // Get all bids by this user on ended auctions
  const allUserBids = await this.bidRepository
    .createQueryBuilder('bid')
    .leftJoinAndSelect('bid.product', 'product')
    .where('bid.bidderId = :userId', { userId })
    .getMany();

  // Filter ended auctions using your same logic
  const userBidsOnEndedAuctions = allUserBids.filter(bid => {
   return this.getLocalDateTime() >= this.formatUTCToLocalString(bid.product.endTime)
  });


  const wonProducts:any = [];

  // Check each product to see if user had the highest bid
  for (const userBid of userBidsOnEndedAuctions) {
    const highestBidAmount = await this.getCurrentHighestBid(userBid.productId);
    
    // If user's bid matches the highest bid, they won
    if (userBid.amount === highestBidAmount) {
      wonProducts.push({
        productId: userBid.product.id,
        productName: userBid.product.name,
        productDescription: userBid.product.description,
        images: userBid.product.images,
        startingPrice: this.formatCurrency(userBid.product.startingPrice),
        endTime: userBid.product.endTime,
        winningBid: {
          id: userBid.id,
          amount: userBid.amount,
          formattedAmount: this.formatCurrency(userBid.amount),
          bidTime: userBid.createdAt,
          relativeTime: this.formatRelativeTime(userBid.createdAt),
        },
      });
    }
  }

  return {
    success: true,
    message: 'Won auctions retrieved successfully',
    data: {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      wonAuctions: wonProducts,
      totalWon: wonProducts.length,
    },
  };
}

  private formatBidResponse(bid: any): BidResponseDto {
    return {
      id: bid.id,
      amount: bid.amount,
      productId: bid.productId,
      bidderId: bid.bidderId,
      bidderName: bid.bidder,
      productDetails: bid.product,
      createdAt: bid.createdAt,
      formattedAmount: this.formatCurrency(bid.amount),
      relativeTime: this.formatRelativeTime(bid.createdAt),
    };
  }

  private formatCurrency(amount: number): string {
    return `$${amount.toLocaleString()}`;
  }

  private formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}min ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d ago`;
    }
  }


 getLocalDateTime = () => {
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



}


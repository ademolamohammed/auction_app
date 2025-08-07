// src/bid/bid.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Adjust path as needed

@Controller('bids')
// @UseGuards(JwtAuthGuard) // Uncomment when you have authentication set up
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Post()
  async create(@Body() createBidDto: CreateBidDto) {
    const bid = await this.bidService.create(createBidDto);
    return {
      message: 'Bid placed successfully',
      bid,
    };
  }

  @Get()
  async findAll() {
    return await this.bidService.findAll();
  }

  @Get('my-bids/:userId')
  async findMyBids(@Param('userId') userId:string) {
    // const userId = req.user.id; // Get from JWT token
    return await this.bidService.findByUser(userId);
  }

  @Get('bid-won/:userId')
  async getBidWonByUser(@Param('userId') userId:string) {
    // const userId = req.user.id; // Get from JWT token
    return await this.bidService.getWonAuctions(userId);
  }

  @Get('product/:productId')
  async findByProduct(@Param('productId') productId: string) {
    return await this.bidService.findByProduct(productId);
  }

  @Get('product/:productId/bidders')
  async getProductBidders(
    @Param('productId') productId: string,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return await this.bidService.getProductBidders(productId, limit);
  }

  @Get('product/:productId/highest')
  async getCurrentHighestBid(@Param('productId') productId: string) {
    const highestBid = await this.bidService.getCurrentHighestBid(productId);
    return {
      productId,
      highestBid,
      formattedAmount: `$${highestBid.toLocaleString()}`,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.bidService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBidDto: UpdateBidDto,
    @Request() req,
  ) {
    // const userId = req.user.id; // Get from JWT token
    const userId = 2; // Temporary - replace with actual user ID from token
    return await this.bidService.update(id, updateBidDto, updateBidDto.userId);
  }

@Delete(':id')
async remove(
  @Param('id') id: string,
  @Query('userId') userId: string
) {
  await this.bidService.remove(id, userId);
  return { message: 'Bid removed successfully' };
}
}
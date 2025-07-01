import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';

@Controller('bids')
export class BidsController {
  constructor(private readonly bidService: BidsService) {}

  // POST /bids - Place a bid (auth required)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async placeBid(@Body() dto: CreateBidDto, @Request() req) {
    return this.bidService.placeBid(dto, req.user.sub);
  }

  // GET /bids/user/:id - Get all bids placed by a user
  @Get('user/:id')
  getUserBids(@Param('id') id: string) {
    return this.bidService.getBidsByUser(id);
  }
}

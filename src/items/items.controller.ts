import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ItemsService } from './items.service';
import { BidsService } from '../bids/bids.service'; // cross-service
import { CreateItemDto } from './dto/create-item.dto';

@Controller('items')
export class ItemsController {
  constructor(
    private readonly itemService: ItemsService,
    private readonly bidService: BidsService,
  ) {}

  // POST /items - Create new item (auth required)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  createItem(@Body() dto: CreateItemDto, @Request() req) {
    return this.itemService.create(dto, req.user.sub);
  }

  // GET /items - List all items
  @Get()
  getAllItems() {
    return this.itemService.getAll();
  }

  // GET /items/:id - Get item details
  @Get(':id')
  getItem(@Param('id') id: string) {
    return this.itemService.getById(id);
  }

  // GET /items/:id/bids - Get bids for an item
  @Get(':id/bids')
  getItemBids(@Param('id') id: string) {
    return this.bidService.getBidsForItem(id); // cross-service call
  }
}

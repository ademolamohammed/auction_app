import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bid, BidDocument } from './schemas/bid.schema';
import { CreateBidDto } from './dto/create-bid.dto';
import { Item, ItemDocument } from '../items/items.schema';
import { InjectModel as InjectItemModel } from '@nestjs/mongoose';

@Injectable()
export class BidsService {
  constructor(
    @InjectModel(Bid.name) private bidModel: Model<BidDocument>,
    @InjectItemModel(Item.name) private itemModel: Model<ItemDocument>,
  ) {}

  async placeBid(dto: CreateBidDto, userId: string) {
    const item = await this.itemModel.findById(dto.itemId);
    if (!item) throw new BadRequestException('Item not found');

    if (dto.amount <= item.currentBid) {
      throw new BadRequestException('Bid must be higher than current bid');
    }

    // Update current bid on the item
    item.currentBid = dto.amount;
    await item.save();

    return this.bidModel.create({
      itemId: dto.itemId,
      userId,
      amount: dto.amount,
    });
  }

  async getBidsByUser(userId: string) {
    return this.bidModel.find({ userId }).populate('itemId').exec();
  }

  async getBidsForItem(itemId: string) {
    return this.bidModel.find({ itemId }).sort({ amount: -1 }).exec();
  }
}

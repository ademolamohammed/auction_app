import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item, ItemDocument } from './items.schema';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
  ) {}

  async create(dto: CreateItemDto, sellerId: string) {
    const item = await this.itemModel.create({
      ...dto,
      sellerId,
      currentBid: dto.startingBid,
    });
    return item;
  }

  async getAll() {
    return this.itemModel.find().sort({ deadline: 1 }).exec();
  }

  async getById(id: string) {
    return this.itemModel.findById(id).exec();
  }
}

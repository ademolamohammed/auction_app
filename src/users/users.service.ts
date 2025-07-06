import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { Bid, BidDocument } from '../bids/schemas/bid.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Bid.name) private bidModel: Model<BidDocument>,
  ) {}

  async getById(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getBidsByUser(userId: string) {
    return this.bidModel.find({ userId }).populate('itemId').exec();
  }
}

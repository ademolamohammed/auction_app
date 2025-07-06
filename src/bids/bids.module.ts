import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { Bid, BidSchema } from './schemas/bid.schema';
import { Item, ItemSchema } from '../items/items.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bid.name, schema: BidSchema },
      { name: Item.name, schema: ItemSchema },
    ]),
  ],
  controllers: [BidsController],
  providers: [BidsService],
  exports: [BidsService],
})
export class BidsModule {}

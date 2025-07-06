import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema({ timestamps: true })
export class Item {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  startingBid: number;

  @Prop({ required: true })
  deadline: Date;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sellerId: Types.ObjectId;

  @Prop({ default: 0 })
  currentBid: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);

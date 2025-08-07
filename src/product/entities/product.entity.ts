// src/product/entities/product.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Bid } from '../../bid/entities/bid.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column('decimal', { precision: 15, scale: 2 })
  startingPrice: number;

  @Column('datetime')
  endTime: Date;

  @Column('text')
  description: string;

  @Column({ default: false })
  isNotificationSent: boolean;

  @Column('json', { nullable: true })
  images: string[]; // Array of image URIs

  @Column({ nullable: true })
  sellerId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'sellerId' })
  seller: User;

  @OneToMany(() => Bid, (bid) => bid.product, { cascade: true })
  bids: Bid[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual property to get current highest bid
  get currentHighestBid(): number {
    if (!this.bids || this.bids.length === 0) {
      return this.startingPrice;
    }
    return Math.max(...this.bids.map(bid => bid.amount));
  }

  // Virtual property to check if auction is active
  get isActive(): boolean {
    return new Date() < this.endTime;
  }
}
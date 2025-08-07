// src/product/entities/bid.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity'; // Adjust path as needed
import { Product } from '../../product/entities/product.entity';

@Entity('bids')
export class Bid {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column()
  productId: string;

  @Column()
  bidderId: string;

  @ManyToOne(() => Product, (product) => product.bids, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'bidderId' })
  bidder: User;

  @CreateDateColumn()
  createdAt: Date;
}
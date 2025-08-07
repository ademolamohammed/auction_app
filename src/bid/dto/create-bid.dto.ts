import { IsNotEmpty, IsNumber, IsPositive, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from 'src/product/dto/create-product.dto';

export class CreateBidDto {
  @IsString()
  @Type(() => String)
  @ApiProperty()
  productId: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiProperty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;
}


export class BidResponseDto {
  id: string;
  amount: number;
  productId: string;
  bidderId: string;
  bidderName: string;
  productDetails: ProductResponseDto;
  createdAt: Date;
  formattedAmount: string;
  relativeTime: string;
}

export class ProductBidderDto {
  name: string;
  amount: string;
  dateTime: string;
}

export class ProductBidsResponseDto {
  productId: string;
  productName: string;
  currentHighestBid: string;
  totalBids: number;
  bidders: ProductBidderDto[];
}
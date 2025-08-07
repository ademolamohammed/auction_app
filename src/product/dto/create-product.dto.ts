// src/product/dto/create-product.dto.ts
import { IsString, IsNumber, IsDateString, IsArray, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { BidResponseDto } from 'src/bid/dto/create-bid.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiProperty()
  startingPrice: number;

  @IsDateString()
  @ApiProperty()
  endTime: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsArray()
  @ApiProperty()
  @IsString({ each: true })
  images?: string[];
}



export class ProductResponseDto {
  id: string;
  name: string;
  startingPrice: string;
  endTime: string;
  description: string;
  image: string[];
  bidders: BidResponseDto[];
}
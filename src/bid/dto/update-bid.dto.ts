import { CreateBidDto } from './create-bid.dto';
import { IsNotEmpty, IsString, Min } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';


export class UpdateBidDto extends PartialType(CreateBidDto) {
      @IsString()
      @IsNotEmpty()
      @ApiProperty()
      userId: string;
}
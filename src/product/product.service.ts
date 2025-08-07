import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto, ProductResponseDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BidService } from '../bid/bid.service';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path'; 

interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @Inject(forwardRef(() => BidService))
    private bidService: BidService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create({
      ...createProductDto,
      endTime: new Date(createProductDto.endTime),
      // No sellerId - your business is the implicit owner
    });

    return await this.productRepository.save(product);
  }

  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.find({
      order: { createdAt: 'DESC' },
    });

    const productsWithBidders = await Promise.all(
      products.map(async (product) => {
        const bidders = await this.bidService.getProductBidders(product.id);
        return this.formatProductResponse(product, bidders);
      })
    );

    return productsWithBidders;
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const bidders = await this.bidService.getProductBidders(id);
    return this.formatProductResponse(product, bidders);
  }

  // ✅ NO ownership checks - you own everything, you can edit anything
  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Optional: Prevent updates if auction has active bids
    const currentHighestBid = await this.bidService.getCurrentHighestBid(id);
    if (currentHighestBid > product.startingPrice) {
      throw new BadRequestException('Cannot update product that already has bids');
    }

    Object.assign(product, updateProductDto);
    if (updateProductDto.endTime) {
      product.endTime = new Date(updateProductDto.endTime);
    }

    return await this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productRepository.remove(product);
  }

  async uploadImages(files: UploadedFile[]): Promise<string[]> {
  console.log('uploadImages called with files:', files?.length || 0);
  
  if (!files || !Array.isArray(files) || files.length === 0) {
    throw new BadRequestException('No files provided');
  }

  const uploadDir = join(process.cwd(), 'uploads', 'products');
  
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('Created upload directory:', uploadDir);
    }
  } catch (error) {
    console.error('Failed to create upload directory:', error);
    throw new BadRequestException('Failed to create upload directory');
  }

  const imageUris: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    if (!file || !file.originalname || !file.buffer || file.buffer.length === 0) {
      throw new BadRequestException(`Invalid file data at index ${i}`);
    }

    try {
      const fileExtension = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      const filePath = join(uploadDir, fileName);
      
      console.log(`Writing file to: ${filePath}`);
      fs.writeFileSync(filePath, file.buffer);
      
      if (!fs.existsSync(filePath)) {
        throw new Error('File was not written successfully');
      }

      // ✅ URI format that matches your static serving
      const uri = `/uploads/products/${fileName}`;
      imageUris.push(uri);
      
      console.log(`Successfully saved file: ${fileName}`);
    } catch (error) {
      console.error(`Failed to save file ${file.originalname}:`, error);
      throw new BadRequestException(`Failed to save file ${file.originalname}: ${error.message}`);
    }
  }

  console.log('All files processed successfully:', imageUris);
  return imageUris;
}

  async getCurrentHighestBid(productId: string): Promise<number> {
    return await this.bidService.getCurrentHighestBid(productId);
  }

  private formatProductResponse(product: Product, bidders: any[]): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      startingPrice: this.formatCurrency(product.startingPrice),
      endTime: this.formatTimeRemaining(product.endTime),
      description: product.description,
      image: product.images || [],
      bidders: bidders || [],
    };
  }

  private formatCurrency(amount: number): string {
    return `$${amount.toLocaleString()}`;
  }

  private formatTimeRemaining(endTime: Date): string {
    const now = new Date();
    const timeDiff = endTime.getTime() - now.getTime();
    console.log(now,timeDiff)

    if (timeDiff <= 0) {
      return 'Auction ended';
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  }
}
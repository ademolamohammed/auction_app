import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  ParseIntPipe,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // ✅ NO userId needed - your business creates all products
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productService.create(createProductDto);
    return {
      message: 'Product created successfully',
      product,
    };
  }

  @Post('upload-images')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: require('multer').memoryStorage(),
      fileFilter: (req: any, file: any, callback: any) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          return callback(new BadRequestException('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
        files: 10,
      },
    })
  )
  
  async uploadImages(@UploadedFiles() files: any[]) {
    console.log('Files received:', files?.length || 0);
    
    if (files && files.length > 0) {
      files.forEach((file, index) => {
        console.log(`File ${index}:`, {
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          hasBuffer: !!file.buffer,
          bufferLength: file.buffer?.length || 0,
        });
      });
    }

    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    for (const file of files) {
      if (!file.buffer || file.buffer.length === 0) {
        throw new BadRequestException(`Invalid file data for ${file.originalname}`);
      }
    }

    try {
      const imageUris = await this.productService.uploadImages(files);
      return {
        message: 'Images uploaded successfully',
        imageUris,
        count: imageUris.length,
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw new BadRequestException(`Failed to upload images: ${error.message}`);
    }
  }

  @Get()
  async findAll() {
    return await this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(id);
  }

  @Get(':id/current-highest-bid')
  async getCurrentHighestBid(@Param('id') id: string) {
    const highestBid = await this.productService.getCurrentHighestBid(id);
    return {
      productId: id,
      currentHighestBid: highestBid,
      formattedAmount: `$${highestBid.toLocaleString()}`,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productService.update(id, updateProductDto);
    return {
      message: 'Product updated successfully',
      product,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.productService.remove(id);
    return { message: 'Product deleted successfully' };
  }
}
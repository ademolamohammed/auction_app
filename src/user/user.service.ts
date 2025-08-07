import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/email/email.service';

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private usersRepository:Repository<User>,
    private mailService: MailService, 

){}

  async createUser (createUserDto:CreateUserDto):Promise<User> {
   try{
    const newUser = this.usersRepository.create(createUserDto);
    const userResponse = await this.usersRepository.save(newUser);
    return userResponse;
   }catch(error){
    throw new Error(error)
   }
  }

  findUserByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({where:{ username }});
  }

   getAllUsers(): Promise<User[] | null> {
    try{
      return this.usersRepository.find();
    }catch(error){
      throw error;
    }
  }

async updateUser(updateUserDto: UpdateUserDto, id: string): Promise<User> {
  try {
    console.log(`📝 Updating user ${id} with data:`, updateUserDto);

    const existingUser = await this.usersRepository.findOne({
      where: { id }
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updateFields = Object.keys(updateUserDto).filter(key => 
      updateUserDto[key] !== undefined && 
      updateUserDto[key] !== null && 
      updateUserDto[key] !== ''
    );

    if (updateFields.length === 0) {
      throw new BadRequestException('No valid fields provided for update');
    }

    const updateData: Partial<User> = {};
    
    if (updateUserDto.firstName !== undefined) {
      updateData.firstName = updateUserDto.firstName.trim();
    }
    
    if (updateUserDto.lastName !== undefined) {
      updateData.lastName = updateUserDto.lastName.trim();
    }
    
    if (updateUserDto.address !== undefined) {
      updateData.address = updateUserDto.address.trim();
    }

    const hasChanges = Object.entries(updateData).some(([key, value]) => 
      existingUser[key] !== value
    );

    if (!hasChanges) {
      const { password, ...userWithoutPassword } = existingUser;
      return userWithoutPassword as User;
    }

    const result = await this.usersRepository.update(id, updateData);

    if (result.affected === 0) {
      throw new BadRequestException('Failed to update user - no rows affected');
    }

    const updatedUser = await this.usersRepository.findOne({
      where: { id }
    });

    if (!updatedUser) {
      throw new NotFoundException('User not found after update');
    }

    const { password, ...userWithoutPassword } = updatedUser;
    
    return userWithoutPassword as User;

  } catch (error) {
    
    if (error instanceof NotFoundException || error instanceof BadRequestException) {
      throw error;
    }
    
    if (error.code === '23505') { 
      throw new ConflictException('Email or username already exists');
    }
    
    throw new BadRequestException(`Failed to update user: ${error.message}`);
  }
}

}

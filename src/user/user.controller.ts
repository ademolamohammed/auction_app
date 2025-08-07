import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/auth/constant';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile/:username')
  async findUserByUsername(@Param("username") username: string) {
      return await this.userService.findUserByUsername(username);
  }

  @Get()
  async getUsers() {
      return await this.userService.getAllUsers();
  }

  @Patch("/:id")
  async updateUser(@Param('id') id: string,@Body() updateUserDto: UpdateUserDto) {
    try{
      return  await this.userService.updateUser(updateUserDto,id);
    }catch(error){
      throw error;
    }

  }


}

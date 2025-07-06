import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // GET /users/me - Requires JWT Auth
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Request() req) {
    return this.userService.getById(req.user.sub);
  }

  // GET /users/:id/bids
  @Get(':id/bids')
  getUserBids(@Param('id') id: string) {
    return this.userService.getBidsByUser(id);
  }
}

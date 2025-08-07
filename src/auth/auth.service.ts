import { Body, Injectable,UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/email/email.service';


@Injectable()
export class AuthService {
 
   constructor(private usersService: UserService,
    private mailService: MailService, 
    private jwtService: JwtService,private configService: ConfigService) {}

  async signUp(createUserDto:CreateUserDto ): Promise<any> {

    const user = await this.usersService.createUser(createUserDto);
    try {
        await this.mailService.sendSignupEmail(user.email,user.username,user.email);
        console.log("Test email sent successfully");
      } catch (error) {
        console.error("Email failed:", error);
    }
    return user;
  }
  
   async signIn(username: string, password: string): Promise<any> {
    try{
      const user = await this.usersService.findUserByUsername(username);
      if(!user) throw new Error("User not found !!")
      const isMatch = await bcrypt.compare(password, user?.password);
      if(!isMatch) throw new Error("Invalid username or password!!");
      
      const payload = { sub: user?.id, username: user?.username };
      const jwt = this.configService.get<string>('JWT_SECRET');
      try {
        await this.mailService.sendLoginEmail(user.email,user.username,user.email);
        console.log("Test email sent successfully");
      } catch (error) {
        console.error("Email failed:", error);
    }
      // TODO: Generate a JWT and return it here
      // instead of the user object
      return {
          ...user,
          access_token: await this.jwtService.signAsync(payload)
      }
    }catch(error){
      throw new Error(error);
    }
  }
}

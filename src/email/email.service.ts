import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendAuctionWinNotification(to:string,userName:string, productName: string, amount: number,auctionEndTime:Date,userEmail:string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Sucessful bid Email',
      template: 'bid.template',
      context:{
        userName,
        productName,
        amount,
        auctionEndTime,
        userEmail,
        logoUrl: `http://localhost:3000/uploads/logo/silent_auction.png`
      }
    });
  }

  async sendBidConfirmation(to:string,userName:string, productName: string, amount: number,auctionEndTime:Date,userEmail:string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Sucessful bid Email',
      template: 'bid.template',
      context:{
        userName,
        productName,
        amount,
        auctionEndTime,
        userEmail,
        logoUrl: `http://localhost:3000/uploads/logo/silent_auction.png`
      }
    });
  }

    async sendLoginEmail(to: string,userName:string,userEmail:string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Login Email',
      template: 'signin.template',
      context:{
        userName,
        userEmail,
        logoUrl: `http://localhost:3000/uploads/logo/silent_auction.png`
      }
    });
  }

  async sendSignupEmail(to: string,userName:string,userEmail:string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Signup Email',
      template: 'signup.template',
      context:{
        userName,
        userEmail,
        logoUrl: `http://192.168.1.239:3000/uploads/logo/silent-auction.png`, 
      }
    });
  }
}



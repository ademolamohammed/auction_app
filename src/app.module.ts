import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { BidsModule } from './bids/bids.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/silent-auction'), // Replace with your DB URI
    AuthModule,
    UsersModule,
    ItemsModule,
    BidsModule,
  ],
})
export class AppModule {}

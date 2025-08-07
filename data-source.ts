import { DataSource } from 'typeorm';
import { User } from './src/user/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'computer007',
  database: 'silent_auction',
  entities: [__dirname + '/src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'], //where to find my migrations folder
  synchronize: false,
});

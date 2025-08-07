import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import { hashPassword } from '../user.utils';

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({unique:true})
    username: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({unique:true})
    email:string;

    @Column()
    password:string;

    @Column({nullable:true})
    address: string;

    @Column({nullable:true})
    phoneNo: number;

    @Column({default:false})
    hasCurrentBid: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    async setPassword(password: string) {
        if (password || this.password) {
        this.password = await hashPassword(password || this.password);
        }
    }
}

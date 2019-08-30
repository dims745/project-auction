import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class UnverifiedUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    birthDate: string;

    @Column()
    phone: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    verifiedString: string;

    @Column('bigint')
    timeToClear: number;
}

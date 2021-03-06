import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class User {
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

}

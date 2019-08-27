import { IsEmail, IsNotEmpty, IsDate } from 'class-validator';

export class AddUserDto {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsDate()
    @IsNotEmpty()
    birthDate: string;

    @IsNotEmpty()
    phone: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    confirmPassword: string;
}

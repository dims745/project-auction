import { Controller, Get, Post, Body, Response } from '@nestjs/common';
import { readFileSync } from 'fs';
import { LoginUserDto } from 'src/DTO/loginUserDto';
import { AutorizationService } from './autorization.service';
import { AddUserDto } from 'src/DTO/addUserDto';
import md5 from 'md5-es';

@Controller('login')
export class AutorizationController {

    constructor(private readonly authService: AutorizationService) {}

    @Get()
    async putLoginForm() {
        let file = await readFileSync('1.html' , 'utf8');
        file = file.replace('{message}', '');
        return file;
    }

    @Post()
    async checkLogin(@Body() loginUser: LoginUserDto, @Response() res) {
        const user = await this.authService.checkUser(loginUser);
        if (user !== undefined) {
            const jwt = await this.authService.createJwt({email: user.email, id: user.id});
            res.setHeader('Authentication', jwt);
            res.send(jwt);
        } else {
            let file = await readFileSync('1.html', 'utf8');
            file = file.replace('{message}', 'incorrect email or password');
            res.send(file);
        }
    }

    @Get('registration')
    async putRegistrationForm() {
        let file = await readFileSync('2.html' , 'utf8');
        file = file.replace('{message}', '');
        return file;
    }

    @Post('registration')
    async makeRegistration(@Body() addUser: AddUserDto, @Response() res) {
        let file = await readFileSync('2.html', 'utf8');
        const checkValid = await this.authService.validateDataUser(addUser);
        if (!checkValid) {
            let resultOfSendEmail;
            const resultOfAddUser = await this.authService.addUser(addUser);
            const verifyString = await md5.hash('userIdforHash' + resultOfAddUser.id.toString());
            if (resultOfAddUser) { resultOfSendEmail = await this.authService.sendLetterVerify(addUser, verifyString); }
            if (resultOfAddUser && resultOfSendEmail) {
                file = file.replace('{message}', 'OK. Wait letter on your email with link for verification');
                res.send(file);
            } else {
                file = file.replace('{message}', 'Error of registration. Check your data and try again');
                res.send(file);
            }
        } else {
            file = file.replace('{message}', checkValid);
            res.send(file);
        }
    }

    @Get('/registration/verify')
    async showSucces() {
        const file = await readFileSync('3.html' , 'utf8');
        return file;
    }

}

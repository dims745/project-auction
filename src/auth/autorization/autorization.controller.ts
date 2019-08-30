import { Controller, Get, Post, Body, Response, Req } from '@nestjs/common';
import { readFileSync } from 'fs';
import { LoginUserDto } from 'src/DTO/loginUserDto';
import { AutorizationService } from './autorization.service';
import { AddUserDto } from 'src/DTO/addUserDto';
import { Request } from 'express';
import { EmailDTO } from 'src/DTO/emailDto';

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
        let verifyLetter = await readFileSync('verifyLetter.html', 'utf8');
        let file = await readFileSync('2.html', 'utf8');
        const checkValid = await this.authService.validateDataUser(addUser);
        if (!checkValid) {
            let resultOfSendEmail;
            const verifyString = await this.authService.addUser(addUser);
            if (verifyString) {
                verifyLetter = verifyLetter.replace('{message}', verifyString);
                resultOfSendEmail = await this.authService.sendLetter(addUser.email, verifyLetter);
            }
            if (verifyString && resultOfSendEmail) {
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
    async showSucces(@Req() request: Request) {
        const verify = await this.authService.makeVerify(request.query.key);
        if (verify) {
            const file = await readFileSync('3.html' , 'utf8');
            return file;
        } else { return '<h3>incorrect query</h3>'; }
    }

    @Get('/reset')
    async getEmail() {
        const file = await readFileSync('resetForm.html' , 'utf8');
        return file;
    }

    @Post('/reset')
    async checkResetPass(@Body() email: EmailDTO) {
        const dataForReset = await this.authService.createReset(email.email);
        let resetLetter = await readFileSync('resetLetter.html', 'utf8');
        if (!dataForReset) {
            return '<h3>incorrect query</h3>';
        } else {
        resetLetter = resetLetter.replace('{key}', dataForReset.hash).replace('{email}', dataForReset.user.email);
        this.authService.sendLetter(dataForReset.user.email, resetLetter);
        return 'Letter with link for reset has been sending on said email';
        }
    }

    @Get('/reset/query')
    async resetPass(@Req() request: Request) {
        const newPass = await this.authService.resetPass(request.query.email, request.query.key);
        if (newPass) {
            await this.authService.sendLetter(request.query.email, newPass);
            return 'you new pass are send on email (you can change this later)';
        } else { return '<h3>incorrect query</h3>'; }
    }
}

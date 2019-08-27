import { Controller, Get, Post, Body, Response, UseGuards } from '@nestjs/common';
import { readFileSync } from 'fs';
import { LoginUserDto } from 'src/DTO/loginUserDto';
import { AutorizationService } from './autorization.service';
import { AddUserDto } from 'src/DTO/addUserDto';
import { AuthGuard } from '@nestjs/passport';

@Controller('login')
export class AutorizationController {
    constructor(private readonly authService: AutorizationService) {}
    @Get()
    putLoginForm(): string {
        let file = readFileSync('1.html' , 'utf8');
        file = file.replace('{message}', '');
        return file;
    }

    @UseGuards(AuthGuard('local'))
    @Post()
    async checkLogin(@Body() loginUser: LoginUserDto, @Response() res) {
        const user = await this.authService.checkUser(loginUser);
        if (user !== undefined) {
            res.redirect('/');
        } else {
            let file = readFileSync('1.html', 'utf8');
            file = file.replace('{message}', 'incorrect email or password');
            res.send(file);
        }
    }

    @Get('registration')
    async putRegistrationForm() {
        let file = readFileSync('2.html' , 'utf8');
        file = file.replace('{message}', '');
        return file;
    }

    @Post('registration')
    async makeRegistration(@Body() addUser: AddUserDto, @Response() res) {
        const user = await this.authService.addUser(addUser);
        if (user !== undefined) {
            res.redirect('/login/registration/success');
        } else {
            let file = readFileSync('2.html', 'utf8');
            file = file.replace('{message}', 'incorrect email or password');
            res.send(file);
        }
    }

    @Get()
    showSucces() {
        const file = readFileSync('3.html' , 'utf8');
        return file;
    }
}

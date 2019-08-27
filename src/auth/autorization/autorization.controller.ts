import { Controller, Get, Post, Body } from '@nestjs/common';
import { readFileSync } from 'fs';
import { LoginUserDto } from 'src/DTO/loginUserDto';

@Controller('login')
export class AutorizationController {

    @Get()
    putLoginForm(): string {
        const file = readFileSync('1.html' , 'utf8');
        return file;
    }

    @Post()
    checkLogin(@Body() createUserDto: LoginUserDto) {
        // обработка введенных данных
        // редирект на главную страничку или вывод формы с сообщением о неудачной попытке
    }
}

import { Controller, Get } from '@nestjs/common';

@Controller('login')
export class AutorizationController {

    @Get()
    putLoginForm() {}
}

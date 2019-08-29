import { Controller, Get, Response, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { AutorizationService } from './auth/autorization/autorization.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly authService: AutorizationService) {}
  @Get()
  async showPriv(@Request() req) {
    const name = await this.authService.checkJwt(req.header.Authentication);
    if (name) {
      return 'privet' + name.login;
    } else {
      return 'error of authentication';
    }
  }

  @Get('/add')
  insertEntity() {
    const t = this.appService.inputData();
    return '2';
  }
  @Get('/viev')
  getAllEntity() {
    const t = this.appService.showData();
    return t;
  }
}

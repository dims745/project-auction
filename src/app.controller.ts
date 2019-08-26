import { Controller, Get, Response } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
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

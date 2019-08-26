import { Module } from '@nestjs/common';
import { AutorizationController } from './autorization/autorization.controller';

@Module({
  controllers: [AutorizationController],
})
export class AuthModule {}

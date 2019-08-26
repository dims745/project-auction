import { Module } from '@nestjs/common';
import { AutorizationController } from './autorization/autorization.controller';
import { AutorizationService } from './autorization/autorization.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AutorizationController],
  providers: [AutorizationService],
})
export class AuthModule {}

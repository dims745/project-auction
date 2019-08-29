import { Module } from '@nestjs/common';
import { AutorizationController } from './autorization/autorization.controller';
import { AutorizationService } from './autorization/autorization.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AutorizationController],
  providers: [AutorizationService],
})
export class AuthModule {}

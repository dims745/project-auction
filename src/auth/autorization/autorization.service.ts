import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { secretKey } from 'src/auth/secret/secretKey';

@Injectable()
export class AutorizationService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
      ) {}

    async checkUser(loginUser) {
        const user = await this.userRepository.findOne({email: loginUser.login, password: loginUser.password});
        return user;
    }

    async login(user: any) {
        const payload = { login: user.email, password: user.password };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }

    async addUser(userInfo) {
        const user = new User();
        user.firstName = userInfo.firstName;
        user.lastName = userInfo.lastName;
        user.birthDate = userInfo.birthDate;
        user.email = userInfo.email;
        user.phone = userInfo.phone;
        user.password = userInfo.password;
        user.verified = false;
        await this.userRepository.save(user);
    }
}

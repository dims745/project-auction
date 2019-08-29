import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import * as EmailValidator from 'email-validator';

@Injectable()
export class AutorizationService {
  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      private readonly jwtService: JwtService,
    ) {}

  async checkUser(loginUser) {
      const user = await this.userRepository.findOne({
        email: loginUser.login,
        password: loginUser.password});
      return user;
  }

  async createJwt(user: any) {
    const payload = { login: user.email, id: user.id };
    const token = this.jwtService.sign(payload);
    return token;
  }

  async checkJwt(token) {
    const result = await this.jwtService.verifyAsync(token)
    .then((res) => res)
    .catch((err) => undefined);
    return result;
  }

  async validateDataUser(req) {
    const re = /^\d[\d\(\)\ -]{4,14}\d$/;
    const date = new Date().toISOString().slice(0, 10);
    const dat = (+date.slice(0, 4) - 21) + date.slice(4, 10);

    if (!(EmailValidator.validate(req.email))) {
        return 'email is no valid';
    }
    if (dat < req.birthDate) {
        return 'You are under 21 years old. Come back when you get older';
    }
    if (!re.test(req.phone)) {
        return 'you phone nubmer is incorrect (example 3809990990665)';
    }
    if (req.password1 !== req.password2) {
        return 'passwords are different';
    }
    const result = await this.userRepository.findOne({email: req.email});
    if (result) {
        return 'this email are busy';
    } else { return false; }
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
      const res = await this.userRepository.save(user)
        .then((result) => result)
        .catch((err) => undefined);
      return res;
  }

  async sendLetterVerify(user, message) {
    const transporter = await nodemailer.createTransport(
      {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'sender@gmail.com',
          pass: 'password',
        },
      });
    const mailOptions = {
      from: 'sender@gmail.com',
      to: user.email,
      subject: 'Verification Link',
      html: `<a href='localhost:3000/login/registration/verify?key=${message}'>link</a>`,
    };
    return await transporter.sendMail(mailOptions).then((result) => true).catch(() => false);
  }
}

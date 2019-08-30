import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import * as EmailValidator from 'email-validator';
import { UnverifiedUser } from 'src/entity/unverifiedUser.entity';
import md5 from 'md5-es';
import * as passGenerate from 'password-generator';

@Injectable()
export class AutorizationService {
  constructor(
      @InjectRepository(UnverifiedUser)
      private readonly unverifiedUserRepository: Repository<UnverifiedUser>,
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      private readonly jwtService: JwtService,
    ) {}

  async checkUser(loginUser) {
      const password = await md5.hash(loginUser.password);
      const user = await this.userRepository.findOne({
        email: loginUser.login,
        password});
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
    const phoneString = /^\d[\d\(\)\ -]{4,14}\d$/;
    const date = new Date().toISOString().slice(0, 10);
    const dat = (+date.slice(0, 4) - 21) + date.slice(4, 10);

    if (!(EmailValidator.validate(req.email))) {
        return 'email is no valid';
    }
    if (dat < req.birthDate) {
        return 'You are under 21 years old. Come back when you get older';
    }
    if (!phoneString.test(req.phone)) {
        return 'you phone nubmer is incorrect (example 380999066065)';
    }
    if (req.password1 !== req.password2) {
        return 'passwords are different';
    }
    const result = await this.userRepository.findOne({email: req.email}) || await this.unverifiedUserRepository.findOne({email: req.email});
    if (result) {
        return 'this email are busy';
    } else { return false; }
}

  async addUser(userInfo) {
      const id = await this.unverifiedUserRepository.count();
      const user = new UnverifiedUser();
      user.firstName = userInfo.firstName;
      user.lastName = userInfo.lastName;
      user.birthDate = userInfo.birthDate;
      user.email = userInfo.email;
      user.phone = userInfo.phone;
      user.password = await md5.hash(userInfo.password);
      user.verifiedString = await md5.hash('userIdforHash' + id.toString());
      user.timeToClear = new Date().getTime() + 24 * 1000 * 3600;

      const res = await this.unverifiedUserRepository.save(user)
        .then((result) => user.verifiedString)
        .catch((err) => undefined);
      return res;
  }

  async sendLetter(email, message) {
    const transporter = await nodemailer.createTransport(
      {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'dimatimoshen@gmail.com',
          pass: '',
        },
      });
    const mailOptions = {
      from: 'dimchek <dimatimoshen@gmail.com>',
      to: email,
      subject: 'Auction Service',
      html: message,
    };
    return await transporter.sendMail(mailOptions).then((result) => true).catch(() => false);
  }

  async makeVerify(key) {
    const user = await this.unverifiedUserRepository.findOne({verifiedString: key});
    if (user) {
      const newUser = new User();
      newUser.firstName = user.firstName;
      newUser.lastName = user.lastName;
      newUser.birthDate = user.birthDate;
      newUser.email = user.email;
      newUser.phone = user.phone;
      newUser.password = user.password;
      await this.unverifiedUserRepository.remove(user);
      return await this.userRepository.save(newUser);
    } else { return false; }
  }

  async createReset(email) {
    const user = await this.userRepository.findOne({email});
    if (!user) {return false; }
    return {hash: await md5.hash('string for security of reset' + user.id + new Date().getDay()), user};
  }

  async resetPass(email, key) {
    const user = await this.userRepository.findOne({email});
    const hash = await md5.hash('string for security of reset' + user.id + new Date().getDay());
    if (key !== hash) {
      return false;
    } else {
      const pass = await passGenerate();
      user.password = await md5.hash(pass);
      await this.userRepository.save(user);
      return pass;
    }
  }
}

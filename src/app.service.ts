import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async showData() {
    return await this.userRepository.find();
  }

  async inputData() {
    const user = new User();
    user.firstName = 'vasya';
    user.lastName = 'petrov';
    user.birthDate = '22-22-2222';
    user.email = '33334gtfe';
    user.phone = 'ergerv';
    user.password = 'hard';
    user.verified = false;
    return await this.userRepository.save(user);
  }

  async deleteData() {
    const t = await this.userRepository.find();
    await this.userRepository.remove(t);
    return await this.userRepository.find();
  }
}

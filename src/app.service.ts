import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnverifiedUser } from 'src/entity/unverifiedUser.entity';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(UnverifiedUser)
    private readonly userRepository: Repository<UnverifiedUser>,
  ) {}

  async showData() {
    return await this.userRepository.find();
  }

  async inputData() {
    const user = new UnverifiedUser();
    user.firstName = 'vasya';
    user.lastName = 'petrov';
    user.birthDate = '22-22-2222';
    user.email = '33334gtfe';
    user.phone = 'ergerv';
    user.password = 'hard';
    return await this.userRepository.save(user);
  }

  async deleteData() {
    const t = await this.userRepository.find();
    await this.userRepository.remove(t);
    return await this.userRepository.find();
  }
}

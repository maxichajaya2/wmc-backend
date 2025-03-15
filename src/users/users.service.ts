import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';
import { REQUEST } from '@nestjs/core';
import { User } from '../domain/entities/user.entity';
import { UsersRepository } from '../domain/repositories/users.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
// import { PASSWORD_SALT_ROUNDS } from './constants';
// import { MailService } from '../common/services/mail.service';

@Injectable({ scope: Scope.REQUEST })
export class UsersService {

  constructor(
    // private readonly mailService: MailService,
    @Inject(REQUEST) private request: Request,
    private readonly usersRepository: UsersRepository,
  ) { }

  async findAll({ onlyActive } = { onlyActive: false }) {
    const where = {};
    if (onlyActive) {
      where['isActive'] = true;
    }
    return this.usersRepository.repository.find({
      where
    });
  }

  async create(createUserDto: CreateUserDto) {
    return this.usersRepository.create(createUserDto);
  }

  async findOne(id: number, { onlyActive } = { onlyActive: false }) {
    const where = { id };
    if (onlyActive) {
      where['isActive'] = true;
    }
    const user = await this.usersRepository.repository.findOne({
      where
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    console.log('updateUserDto', updateUserDto);
    const updatedUser = await this.usersRepository.update(id, updateUserDto);
    return updatedUser;
  }

  getLoggedUser(): User | null {
    return this.request['loggedUser'] ?? null;
  }

  async delete(id: number) {
    await this.usersRepository.delete(id);
  }
}

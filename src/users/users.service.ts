import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, Scope } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';
import { REQUEST } from '@nestjs/core';
import { User } from '../domain/entities/user.entity';
import { UsersRepository } from '../domain/repositories/users.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesRepository } from '../domain/repositories/roles.repository';
import { CategoriesRepository } from '../domain/repositories/categories.repository';
// import { PASSWORD_SALT_ROUNDS } from './constants';
// import { MailService } from '../common/services/mail.service';

@Injectable({ scope: Scope.REQUEST })
export class UsersService {

  constructor(
    // private readonly mailService: MailService,
    @Inject(REQUEST) private request: Request,
    private readonly usersRepository: UsersRepository,
    private readonly rolesRepository: RolesRepository,
    private readonly categoriesRepository: CategoriesRepository,
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
    console.info(createUserDto);
    const { categoryId, email } = createUserDto;
    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    if (userWithSameEmail) {
      throw new BadRequestException('Email already in use');
    }
    const category = await this.categoriesRepository.repository.findOneOrFail({
      where: {
        id: categoryId
      }
    });
    const role = await this.rolesRepository.repository.findOne({
      where: {
        id: createUserDto.roleId
      }
    });
    if (!role) {
      throw new BadRequestException('Role not found');
    }
    const user = this.usersRepository.repository.create({
      ...createUserDto,
      role,
      category,
      createdAt: new Date()
    });
    try {
      const newUser = await this.usersRepository.repository.save(user);
      return newUser;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    console.log('update user');
    console.log({ id, updateUserDto });
    const user = await this.usersRepository.repository.findOneOrFail({
      where: {
        id
      }
    });
    console.log({ user });
    const { email } = updateUserDto;
    if (email && email !== user.email) {
      const userWithSameEmail = await this.usersRepository.findByEmail(email);
      if (userWithSameEmail) {
        console.log('Email already in use');
        throw new BadRequestException('Email already in use');
      }
    }
    const role = await this.rolesRepository.repository.findOneOrFail({
      where: {
        id: updateUserDto.roleId
      }
    });
    const updatedUser = this.usersRepository.repository.merge(user, updateUserDto);
    updatedUser.role = role;
    const newUser = await this.usersRepository.repository.save(updatedUser);
    console.log({ newUser });
    return newUser;
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

  getLoggedUser(): User | null {
    return this.request['loggedUser'] ?? null;
  }

  async delete(id: number) {
    await this.usersRepository.delete(id);
  }
}

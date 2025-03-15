import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateWebUserDto } from './dto/update-web-user.dto';
import { WebUsersRepository } from '../domain/repositories/web-users.repository';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { WebUser } from './entities/web-user.entity';

@Injectable()
export class WebUsersService {

  constructor(
    private readonly webUsersRepository: WebUsersRepository,
  ){}

  findAll({ onlyActive } = { onlyActive: false }) {
    const where = {};
    if (onlyActive) {
      where['isActive'] = true;
    }
    return this.webUsersRepository.repository.find({
      where
    });
  }

  create(createWebUserDto: CreateUserDto){
    const user: WebUser = {
      ...createWebUserDto,
      createdAt: new Date()
    }
    return this.webUsersRepository.repository.save(user);
  }

  async findOne(id: number, { onlyActive } = { onlyActive: false }) {
    const where = { id };
    if (onlyActive) {
      where['isActive'] = true;
    }
    const wu = await this.webUsersRepository.repository.findOne({
      where
    });
    if (!wu) {
      throw new NotFoundException('User not found');
    }
    return wu;
  }

  update(id: number, updateWebUserDto: UpdateWebUserDto) {
    return this.webUsersRepository.update(id, updateWebUserDto);
  }

  remove(id: number) {
    return this.webUsersRepository.delete(id);
  }

  async findEnrollments(id: number) {
    const webUser = await this.webUsersRepository.repository.findOne({
      where: {
        id
      },
      relations: [
        'enrollments', 
        'enrollments.department', 
        'enrollments.district', 
        'enrollments.province', 
        'enrollments.fee', 
        'enrollments.user'
      ]
    });
    if (!webUser) {
      throw new NotFoundException('User not found');
    }
    return webUser.enrollments;
  }
}

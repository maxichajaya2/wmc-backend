import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateWebUserDto } from './dto/update-web-user.dto';
import { WebUsersRepository } from '../domain/repositories/web-users.repository';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { WebUser } from './entities/web-user.entity';
import { UsersService } from '../users/users.service';
import { AbstractRepository } from '../domain/repositories/abstract.repository';

@Injectable()
export class WebUsersService {
  constructor(
    private readonly webUsersRepository: WebUsersRepository,
    private readonly usersService: UsersService,
    private readonly abstractRepository: AbstractRepository,
  ) {}

  findAll({ onlyActive } = { onlyActive: false }) {
    const where = {};
    if (onlyActive) {
      where['isActive'] = true;
    }
    return this.webUsersRepository.repository.find({
      where,
    });
  }

  create(createWebUserDto: CreateUserDto) {
    const user: WebUser = {
      ...createWebUserDto,
      createdAt: new Date(),
    };
    return this.webUsersRepository.repository.save(user);
  }

  async findOne(id: number, { onlyActive } = { onlyActive: false }) {
    const where = { id };
    if (onlyActive) {
      where['isActive'] = true;
    }
    const wu = await this.webUsersRepository.repository.findOne({
      where,
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

  async getPapers(id: number) {
    const webUser = await this.webUsersRepository.repository.findOne({
      where: {
        id,
      },
      relations: ['papers', 'papers.authors'],
    });
    if (!webUser) {
      throw new NotFoundException('User not found');
    }
    return webUser.papers;
  }

  // async findEnrollments(id: number) {
  //   const webUser = await this.webUsersRepository.repository.findOne({
  //     where: {
  //       id
  //     },
  //     relations: [
  //       'enrollments',
  //       'enrollments.department',
  //       'enrollments.district',
  //       'enrollments.province',
  //       'enrollments.fee',
  //       'enrollments.user'
  //     ]
  //   });
  //   if (!webUser) {
  //     throw new NotFoundException('User not found');
  //   }
  //   return webUser.enrollments;
  // }

  async compareEmailWithAbstract(userId: number) {
    // 1. Obtener web-user
    const webUser = await this.webUsersRepository.repository.findOne({
      where: { id: userId },
    });

    if (!webUser) {
      throw new NotFoundException('Web user not found');
    }

    // 2. Buscar en abstract por email
    const abstractRecord = await this.abstractRepository.repository.find({
      where: { email: webUser.email },
    });

    // 3. Retornar respuesta final
    return {
      userEmail: webUser.email,
      existsInAbstract: !!abstractRecord,
      abstractRecord: abstractRecord ?? null,
    };
  }
}

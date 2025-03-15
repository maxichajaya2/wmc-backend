import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionsRepository } from '../domain/repositories/permissions.repository';

@Injectable()
export class PermissionsService {

  constructor(
    private readonly permissionsRepository: PermissionsRepository,
  ) { }

  create(createPermissionDto: CreatePermissionDto) {
    return this.permissionsRepository.create(createPermissionDto);
  }

  findAll({ onlyActive } = { onlyActive: false }) {
    const where = {};
    if (onlyActive) {
      where['isActive'] = true;
    }
    return this.permissionsRepository.repository.find({
      where
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesRepository } from '../domain/repositories/roles.repository';
import { Role } from '../domain/entities/role.entity';
import { PermissionsRepository } from '../domain/repositories/permissions.repository';
import { AddPermissionDto } from './dto/add-permission.dto';

@Injectable()
export class RolesService {

  constructor(
    private readonly rolesRepository: RolesRepository,
    private readonly permissionsRepository: PermissionsRepository,
  ) { }

  findAll({ onlyActive } = { onlyActive: false }) {
    const where = {};
    if (onlyActive) {
      where['isActive'] = true;
    }
    return this.rolesRepository.repository.find({
      where
    });
  }

  async findOne(id: number, { onlyActive } = { onlyActive: false }) {
    const where = { id };
    if (onlyActive) {
      where['isActive'] = true;
    }
    const role = await this.rolesRepository.repository.find({
      where
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async create(createRoleDto: CreateRoleDto) {
    const { name, permissionIds } = createRoleDto;

    let permissions = [];
    
    if(permissionIds && permissionIds.length > 0){
      permissions = await this.permissionsRepository.findByIds(permissionIds);
    }

    const role: Role = {
      name,
      createdAt: new Date(),
      users: [],
      permissions
    }
    return this.rolesRepository.create(role);
  }

  async addPermission(id: number, addPermissionDto: AddPermissionDto) {
    const { id: permissionId, action, module } = addPermissionDto;
    console.log('Searching role ' + id);
    const role = await this.rolesRepository.findOne(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    if (permissionId) {
      console.debug('Permission id exists in request: ' + permissionId);
      const permission = await this.permissionsRepository.findById(permissionId);
      if (!permission) {
        throw new NotFoundException('Permission not found');
      }
      if (role.permissions.find(p => p.id === permission.id)) {
        console.debug('Permission id already exists in role');
        return role;
      }
      console.log('Permission found: ' + permission.id);
      role.permissions.push(permission);
      console.log('new permissions: ' + role.permissions);
      return this.rolesRepository.update(role);
    }
    console.debug('Permission id does not exist in request');
    const permission = await this.permissionsRepository.create({ action, module });
    console.log('Permission created: ' + permission.id);
    role.permissions.push(permission);
    console.log('new permissions: ' + role.permissions);
    return this.rolesRepository.update(role);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.rolesRepository.findOne(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    const payload = {
      ...role,
      ...updateRoleDto
    }
    return this.rolesRepository.update(payload);
  }

  async removePermission(roleId: number, permissionId: number) {
    const role = await this.rolesRepository.findOne(roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    role.permissions = role.permissions.filter(p => p.id !== permissionId);
    this.rolesRepository.update(role);
  }

  async delete(id: number) {
    this.rolesRepository.delete(id);
  }
}

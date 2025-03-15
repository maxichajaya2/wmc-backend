import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { RolesRepository } from './roles.repository';
import { Role } from '../entities/role.entity';

@Injectable()
export class PermissionsRepository {

    constructor(
        @InjectRepository(Permission)
        public readonly repository: Repository<Permission>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>
    ) { }

    async findAll() {
        return this.repository.find();
    }

    async findById(id: number) {
        return this.repository.findOne({
            where: { id }
        });
    }

    async findByIds(ids: number[]) {
        return this.repository.find({
            where: { id: In(ids) }
        });
    }

    async findByActionAndModule({ action, module }: { action: string, module: string }) {
        return this.repository.findOne({
            where: {
                action,
                module
            }
        });
    }

    async create(permission: Permission) {
        const { action, module } = permission;
        console.log('Searching permission ' + action + ' ' + module);
        const existingPermission = await this.findByActionAndModule({ action, module });
        if (existingPermission) {
            console.log('Permission found: ' + action + ' ' + module);
            return existingPermission;
        }
        console.log('Permission not found: ' + action + ' ' + module);
        const permissionModel = new Permission();
        permissionModel.action = action;
        permissionModel.module = module;
        console.log({ permissionModel });
        try {
            return this.repository.save(permissionModel);
        } catch (error) {
            console.log("ERROR");
            console.log(error);
        }
    }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';


@Injectable()
export class RolesRepository {

    constructor(
        @InjectRepository(Role)
        public readonly repository: Repository<Role>,
    ) { }

    async findAll(){
        return this.repository.find();
    }

    async findById(id: number){
        return this.repository.findOne({
            where: { id },
            relations: ['permissions']
        });
    }

    async create(role: Role){
        return this.repository.save(role);
    }

    async update(role: Role){
        const newRole = await this.repository.save(role);
        return newRole;
    }

    async delete(id: number){
        const role = await this.findById(id);
        if(!role){
            throw new NotFoundException('Role not found');
        }
        role.deletedAt = new Date();
        await this.repository.save(role);
        return null;
    }
}
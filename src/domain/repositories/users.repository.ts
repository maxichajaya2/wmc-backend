import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UpdateUserDto } from '../../users/dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';


@Injectable()
export class UsersRepository {

    constructor(
        @InjectRepository(User)
        public readonly repository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>
    ) { }

    async findAll(): Promise<User[]> {
        return this.repository.find();
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.repository.findOne({
            where: {
                email
            },
            relations: ['role', 'role.permissions']
        });
        console.log({ user });
        return user;
    }

    findById(id: number): Promise<User | null> {
        console.log('searching user ' + id);
        return this.repository.findOne({
            where: {
                id
            }
        });
    }

    async delete(id: number) {
        const user = await this.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        user.deletedAt = new Date();
        await this.repository.save(user);
        return true;
    }
}
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

    async create(preRegisterDto: CreateUserDto) {
        console.info(preRegisterDto);
        const role = await this.roleRepository.findOne({
            where: {
                id: preRegisterDto.roleId
            }
        });
        if (!role) {
            throw new InternalServerErrorException('Role not found');
        }
        const user = this.repository.create({
            ...preRegisterDto,
            role,
            createdAt: new Date()
        });
        try {
            const newUser = await this.repository.save(user);
            return newUser;
        } catch (error) {
            throw new InternalServerErrorException('Error creating user');
        }
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        console.log('update user');
        console.log({ id, updateUserDto });
        const user = await this.findById(id);
        console.log({ user });
        if (!user) {
            throw new InternalServerErrorException('User not found');
        }
        const { email } = updateUserDto;
        if (email && email !== user.email) {
            const userWithSameEmail = await this.findByEmail(email);
            if (userWithSameEmail) {
                console.log('Email already in use');
                throw new BadRequestException('Email already in use');
            }
        }
        const role = await this.roleRepository.findOne({
            where: {
                id: updateUserDto.roleId
            }
        });
        if (!role) {
            throw new BadRequestException('Role not found');
        }
        const updatedUser = this.repository.merge(user, updateUserDto);
        updatedUser.role = role;
        const newUser = await this.repository.save(updatedUser);
        console.log({ newUser });
        return newUser;
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
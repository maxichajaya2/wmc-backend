import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { WebUser } from '../entities/web-user.entity';
import { CreateWebUserDto } from '../../web-users/dto/create-web-user.dto';
import { UpdateWebUserDto } from '../../web-users/dto/update-web-user.dto';


@Injectable()
export class WebUsersRepository {

    constructor(
        @InjectRepository(WebUser)
        public readonly repository: Repository<WebUser>,
    ) { }

    async findAll(): Promise<WebUser[]> {
        return this.repository.find();
    }

    async findByEmail(email: string): Promise<WebUser | null> {
        return this.repository.findOne({
            where: {
                email
            },
        });
    }

    findById(id: number): Promise<WebUser | null> {
        console.log('searching user ' + id);
        return this.repository.findOne({
            where: {
                id
            }
        });
    }

    async create(preRegisterDto: CreateWebUserDto) {
        console.info(preRegisterDto);
        const user = this.repository.create({
            ...preRegisterDto,
            createdAt: new Date()
        });
        try {
            const newUser = await this.repository.save(user);
            return newUser;
        } catch (error) {
            throw new InternalServerErrorException('Error creating web user');
        }
    }

    async update(id: number, updateUserDto: UpdateWebUserDto) {
        const user = await this.findById(id);
        if (!user) {
            throw new InternalServerErrorException('User not found');
        }
        const { email } = updateUserDto;
        if(email && email !== user.email){
            const userWithSameEmail = await this.findByEmail(email);
            if(userWithSameEmail){
                throw new BadRequestException('Email already in use');
            }
        }
        const updatedUser = this.repository.merge(user, updateUserDto);
        try {
            const newUser = await this.repository.save(updatedUser);
            return newUser;
        } catch (error) {
            throw new InternalServerErrorException('Error updating user');
        }
    }

    async delete(id: number) {
        const user = await this.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        user.deletedAt = new Date();
        await this.repository.save(user);
        return null;
    }
}
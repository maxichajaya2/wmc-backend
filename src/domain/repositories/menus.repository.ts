import { Injectable } from '@nestjs/common';
import { Menu } from '../entities/menu.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class MenusRepository {

    constructor(
        @InjectRepository(Menu)
        public readonly repository: Repository<Menu>
    ) { }

    async findAll(){
        return this.repository.find();
    }
}
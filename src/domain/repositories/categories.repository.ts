import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoriesRepository {

    constructor(
        @InjectRepository(Category)
        public readonly repository: Repository<Category>
    ) { }

    async findAll(){
        return this.repository.find();
    }
}
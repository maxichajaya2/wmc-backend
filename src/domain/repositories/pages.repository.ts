import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page } from '../entities/page.entity';

@Injectable()
export class PagesRepository {

    constructor(
        @InjectRepository(Page)
        public readonly repository: Repository<Page>,
    ) { }
}
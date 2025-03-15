import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stand } from '../entities/stand.entity';

@Injectable()
export class StandsRepository {

    constructor(
        @InjectRepository(Stand)
        public readonly repository: Repository<Stand>,
    ) { }
}
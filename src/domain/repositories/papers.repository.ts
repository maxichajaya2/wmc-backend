import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Paper } from '../entities/paper.entity';
import { Repository } from 'typeorm';


@Injectable()
export class PapersRepository {
    
    constructor(
        @InjectRepository(Paper)
        public readonly repository: Repository<Paper>
    ) { }
}
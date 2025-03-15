import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pavilion } from '../entities/pavilion.entity';

@Injectable()
export class PavilionsRepository {

    constructor(
        @InjectRepository(Pavilion)
        public readonly repository: Repository<Pavilion>,
    ) { }
}
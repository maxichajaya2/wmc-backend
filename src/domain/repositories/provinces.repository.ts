import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Province } from '../entities/province.entity';

@Injectable()
export class ProvincesRepository {
    constructor(
        @InjectRepository(Province)
        public readonly repository: Repository<Province>
    ) { }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { District } from '../entities/district.entity';

@Injectable()
export class DistrictsRepository {
    constructor(
        @InjectRepository(District)
        public readonly repository: Repository<District>
    ) { }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fee } from '../entities/fee.entity';

@Injectable()
export class FeesRepository {
    constructor(
        @InjectRepository(Fee)
        public readonly repository: Repository<Fee>
    ) { }
}
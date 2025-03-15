import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conference } from '../entities/conference.entity';

@Injectable()
export class ConferencesRepository {
    constructor(
        @InjectRepository(Conference)
        public readonly repository: Repository<Conference>
    ) { }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConferenceType } from '../entities/conference-type.entity';

@Injectable()
export class ConferenceTypesRepository {
    constructor(
        @InjectRepository(ConferenceType)
        public readonly repository: Repository<ConferenceType>
    ) { }
}
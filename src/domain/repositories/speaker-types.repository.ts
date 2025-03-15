import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpeakerType } from '../entities/speaker-type.entity';

@Injectable()
export class SpeakerTypesRepository {
    constructor(
        @InjectRepository(SpeakerType)
        public readonly repository: Repository<SpeakerType>
    ) { }
}
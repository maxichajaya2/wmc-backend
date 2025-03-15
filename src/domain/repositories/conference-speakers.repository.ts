import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConferenceSpeaker } from '../entities/conference-speakers.entity';

@Injectable()
export class ConferenceSpeakersRepository {
    constructor(
        @InjectRepository(ConferenceSpeaker)
        public readonly repository: Repository<ConferenceSpeaker>
    ) { }
}
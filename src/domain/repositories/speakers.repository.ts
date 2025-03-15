import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Speaker } from '../entities/speaker.entity';

@Injectable()
export class SpeakersRepository {
    constructor(
        @InjectRepository(Speaker)
        public readonly repository: Repository<Speaker>,
    ) { }
}
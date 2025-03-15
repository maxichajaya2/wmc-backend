import { Injectable } from '@nestjs/common';
import { Topic } from '../entities/topic.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TopicsRepository {

    constructor(
        @InjectRepository(Topic)
        public readonly repository: Repository<Topic>
    ) { }
}
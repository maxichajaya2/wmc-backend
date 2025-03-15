import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from '../entities/enrollment.entity';

@Injectable()
export class EnrollmentsRepository {
    constructor(
        @InjectRepository(Enrollment)
        public readonly repository: Repository<Enrollment>
    ) { }
}
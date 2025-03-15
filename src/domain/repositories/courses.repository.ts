import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../entities/course.entity';

@Injectable()
export class CoursesRepository {
    constructor(
        @InjectRepository(Course)
        public readonly repository: Repository<Course>
    ) { }
}
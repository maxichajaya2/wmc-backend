import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parameter } from '../entities/parameter.entity';

@Injectable()
export class ParametersRepository {
    constructor(
        @InjectRepository(Parameter)
        public readonly repository: Repository<Parameter>
    ) { }
}
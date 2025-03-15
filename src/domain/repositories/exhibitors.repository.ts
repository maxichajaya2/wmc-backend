import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exhibitor } from '../entities/exhibitor.entity';

@Injectable()
export class ExhibitorsRepository {

    constructor(
        @InjectRepository(Exhibitor)
        public readonly repository: Repository<Exhibitor>,
    ) { }
}
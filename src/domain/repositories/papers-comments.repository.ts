import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaperComentary } from '../entities/paper-comentary.entity';


@Injectable()
export class PaperCommentsRepository {
    
    constructor(
        @InjectRepository(PaperComentary)
        public readonly repository: Repository<PaperComentary>
    ) { }
}
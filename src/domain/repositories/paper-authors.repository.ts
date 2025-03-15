import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaperAuthor } from '../entities/paper-author.entity';
import { Repository } from 'typeorm';


@Injectable()
export class PaperAuthorsRepository {

    constructor(
        @InjectRepository(PaperAuthor)
        public readonly repository: Repository<PaperAuthor>
    ) { }
}
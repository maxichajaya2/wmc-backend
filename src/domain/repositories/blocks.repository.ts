import { Injectable } from '@nestjs/common';
import { Block } from '../entities/block.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export interface ContentFilters {
    keys: string;
    onlyActive?: string;
}

@Injectable()
export class BlocksRepository {
    constructor(
        @InjectRepository(Block)
        public readonly repository: Repository<Block>
    ) { }
}
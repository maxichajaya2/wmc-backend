import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gallery } from '../entities/gallery.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GalleriesRepository {

    constructor(
        @InjectRepository(Gallery)
        public readonly repository: Repository<Gallery>
    ) { }
}
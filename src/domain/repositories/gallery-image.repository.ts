import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';
import { GalleryImage } from '../entities/gallery.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class GalleryImagesRepository {

    constructor(
        @InjectRepository(GalleryImage)
        public readonly repository: Repository<GalleryImage>
    ) { }
}
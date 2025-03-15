import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PressRelease } from '../entities/press-release.entity';

@Injectable()
export class PressReleasesRepository {

    constructor(
        @InjectRepository(PressRelease)
        public readonly repository: Repository<PressRelease>,
    ) { }
}
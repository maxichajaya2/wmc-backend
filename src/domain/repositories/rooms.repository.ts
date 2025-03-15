import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../entities/room.entity';

@Injectable()
export class RoomsRepository {
    constructor(
        @InjectRepository(Room)
        public readonly repository: Repository<Room>
    ) { }
}
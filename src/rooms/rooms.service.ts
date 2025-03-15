import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomsRepository } from '../domain/repositories/rooms.repository';
import { Room } from '../domain/entities/room.entity';

@Injectable()
export class RoomsService {

  constructor(
    private readonly roomsRepository: RoomsRepository
  ) {}

  create(createRoomDto: CreateRoomDto) {
    const room: Room = {
      ...createRoomDto,
      createdAt: new Date(),
    }
    return this.roomsRepository.repository.save(room);
  }

  findAll({ onlyActive }: { onlyActive: boolean }) {
    const where = {};
    if(onlyActive){
      where['isActive'] = true;
    }
    return this.roomsRepository.repository.find({
      where
    });
  }

  async findOne(id: number, { onlyActive }: { onlyActive: boolean }) {
    const where = { id };
    if(onlyActive){
      where['isActive'] = true;
    }
    const room = await this.roomsRepository.repository.findOne({
      where
    });
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return room;
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    const room = await this.findOne(id, { onlyActive: false});
    if(!room){
      throw new NotFoundException('Room not found');
    }
    const updatedRoom = {
      ...room,
      ...updateRoomDto,
      updatedAt: new Date()
    }
    return this.roomsRepository.repository.save(updatedRoom);
  }

  async remove(id: number) {
    await this.roomsRepository.repository.softDelete(id);
    return null;
  }
}

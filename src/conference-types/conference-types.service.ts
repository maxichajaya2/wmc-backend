import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConferenceTypeDto } from './dto/create-conference-type.dto';
import { UpdateConferenceTypeDto } from './dto/update-conference-type.dto';
import { ConferenceTypesRepository } from '../domain/repositories/conference-types.repository';
import { ConferenceType } from '../domain/entities/conference-type.entity';

@Injectable()
export class ConferenceTypesService {
  constructor(
    private readonly conferenceTypesRepository: ConferenceTypesRepository
  ) { }

  create(createConferenceTypeDto: CreateConferenceTypeDto) {
    const conferenceType: ConferenceType = {
      ...createConferenceTypeDto,
      createdAt: new Date(),
    }
    return this.conferenceTypesRepository.repository.save(conferenceType);
  }

  findAll({ onlyActive }: { onlyActive: boolean }) {
    const where = {};
    if (onlyActive) {
      where['isActive'] = true;
    }
    return this.conferenceTypesRepository.repository.find({
      where
    });
  }

  async findOne(id: number, { onlyActive }: { onlyActive: boolean }) {
    const where = { id };
    if (onlyActive) {
      where['isActive'] = true;
    }
    const room = await this.conferenceTypesRepository.repository.findOne({
      where
    });
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return room;
  }

  async update(id: number, updateConferenceTypeDto: UpdateConferenceTypeDto) {
    const room = await this.findOne(id, { onlyActive: false });
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    const updatedRoom = {
      ...room,
      ...updateConferenceTypeDto,
      updatedAt: new Date()
    }
    return this.conferenceTypesRepository.repository.save(updatedRoom);
  }

  async remove(id: number) {
    await this.conferenceTypesRepository.repository.softDelete(id);
    return null;
  }
}

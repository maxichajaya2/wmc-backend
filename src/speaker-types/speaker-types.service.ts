import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpeakerTypeDto } from './dto/create-speaker-type.dto';
import { UpdateSpeakerTypeDto } from './dto/update-speaker-type.dto';
import { SpeakerTypesRepository } from '../domain/repositories/speaker-types.repository';
import { SpeakerType } from '../domain/entities/speaker-type.entity';

@Injectable()
export class SpeakerTypesService {
  constructor(
      private readonly speakerTypesRepository: SpeakerTypesRepository
    ) {}
  
    create(createSpeakerTypeDto: CreateSpeakerTypeDto) {
      const sp: SpeakerType = {
        ...createSpeakerTypeDto,
        createdAt: new Date(),
      }
      return this.speakerTypesRepository.repository.save(sp);
    }
  
    findAll({ onlyActive }: { onlyActive: boolean }) {
      const where = {};
      if(onlyActive){
        where['isActive'] = true;
      }
      return this.speakerTypesRepository.repository.find({
        where
      });
    }
  
    async findOne(id: number, { onlyActive }: { onlyActive: boolean }) {
      const where = { id };
      if(onlyActive){
        where['isActive'] = true;
      }
      const speaker = await this.speakerTypesRepository.repository.findOne({
        where
      });
      if (!speaker) {
        throw new NotFoundException('Speaker not found');
      }
      return speaker;
    }
  
    async update(id: number, updateSpeakerTypeDto: UpdateSpeakerTypeDto) {
      const speaker = await this.findOne(id, { onlyActive: false});
      if(!speaker){
        throw new NotFoundException('Speaker not found');
      }
      const updatedSpeakerType = {
        ...speaker,
        ...updateSpeakerTypeDto,
        updatedAt: new Date()
      }
      return this.speakerTypesRepository.repository.save(updatedSpeakerType);
    }
  
    async remove(id: number) {
      await this.speakerTypesRepository.repository.softDelete(id);
      return null;
    }
}

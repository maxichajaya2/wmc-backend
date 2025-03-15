import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpeakerDto } from './dto/create-speaker.dto';
import { UpdateSpeakerDto } from './dto/update-speaker.dto';
import { Speaker } from '../domain/entities/speaker.entity';
import { SpeakersRepository } from '../domain/repositories/speakers.repository';
import { SpeakerTypesRepository } from '../domain/repositories/speaker-types.repository';
import { CountriesService } from '../common/services/countries.service';

@Injectable()
export class SpeakersService {

  constructor(
    private readonly speakerRepository: SpeakersRepository,
    private readonly speakerTypeRepository: SpeakerTypesRepository,
    private readonly countriesService: CountriesService,
  ) { }

  async create(createSpeakerDto: CreateSpeakerDto) {
    const speakerType = await this.speakerTypeRepository.repository.findOne({
      where: { id: createSpeakerDto.speakerTypeId }
    })
    if (!speakerType) {
      throw new NotFoundException('Speaker Type not found')
    }
    const { countryCode } = createSpeakerDto;
    if(countryCode){
      const country = this.countriesService.getCountry(countryCode);
      if(!country){
        throw new NotFoundException('Country not found')
      }
    }
    const speaker: Speaker = {
      ...createSpeakerDto,
      speakerType,
      createdAt: new Date(),
    }

    const newSpeaker = await this.speakerRepository.repository.save(speaker);
    return this.toJson(newSpeaker);
  }

  toJson(speaker: Speaker){
    const { countryCode } = speaker;
    const country = this.countriesService.getCountry(countryCode);
    return {
      ...speaker,
      country
    }
  }

  async findAll({onlyActive = false} = {}) {
    const where = {};
    if(onlyActive){
      where['isActive'] = true;
    }
    const speakers = await this.speakerRepository.repository.find({
      where,
    });
    return speakers.map(this.toJson.bind(this));
  }

  async findOne(id: number, {onlyActive = false} = {}) {
    const where = { id };
    if(onlyActive){
      where['isActive'] = true;
    }
    const speaker = await this.speakerRepository.repository.findOne({
      where: where,
    });
    if (!speaker) {
      throw new NotFoundException('Speaker not found')
    }
    return this.toJson(speaker);
  }

  async update(id: number, updateSpeakerDto: UpdateSpeakerDto) {
    const speaker = await this.findOne(id); 
    const { speakerTypeId, countryCode } = updateSpeakerDto;
    if(countryCode && countryCode !== speaker.countryCode){
      const country = this.countriesService.getCountry(countryCode);
      if(!country){
        throw new NotFoundException('Country not found')
      }
    }
    if(speakerTypeId && speakerTypeId !== speaker.speakerTypeId){
      const speakerType = await this.speakerTypeRepository.repository.findOne({
        where: { id: speakerTypeId }
      })
      if (!speakerType) {
        throw new NotFoundException('Speaker Type not found')
      }
      speaker.speakerType = speakerType;
    }
    const updatedSpeaker = {
      ...speaker,
      ...updateSpeakerDto,
      updatedAt: new Date(),
    }
    const us = await this.speakerRepository.repository.save(updatedSpeaker);
    return this.toJson(us);
  }

  remove(id: number) {
    this.speakerRepository.repository.softDelete(id);
    return null;
  }
}

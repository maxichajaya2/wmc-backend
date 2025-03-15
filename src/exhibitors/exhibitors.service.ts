import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExhibitorDto } from './dto/create-exhibitor.dto';
import { UpdateExhibitorDto } from './dto/update-exhibitor.dto';
import { ExhibitorsRepository } from '../domain/repositories/exhibitors.repository';
import { Exhibitor } from '../domain/entities/exhibitor.entity';
import { StandsRepository } from '../domain/repositories/stands.repository';
import { AssignStandsDto } from './dto/asign-stands.dto';
import { In } from 'typeorm';

@Injectable()
export class ExhibitorsService {

  constructor(
    private readonly exhibitorsRepository: ExhibitorsRepository,
    private readonly standsRepository: StandsRepository 
  ) { }

  async create(createExhibitorDto: CreateExhibitorDto) {
    const pressRelease: Exhibitor = {
      ...createExhibitorDto,
      createdAt: new Date(),
    }
    const createdRelease = await this.exhibitorsRepository.repository.save(pressRelease);
    return createdRelease;
  }

  async findAll({ onlyActive } = { onlyActive: false }) {
    let where = {};
    if (onlyActive) {
      where = { isActive: true };
    }
    const exhibitors = await this.exhibitorsRepository.repository.find({
      where,
      relations: ['stands']
    });
    return exhibitors;
  }

  async findOne(id: number) {
    const exhibitor = await this.exhibitorsRepository.repository.findOne({
      where: {
        id
      },
      relations: ['stands']
    });
    if (!exhibitor) {
      throw new NotFoundException('Press release not found');
    }
    return exhibitor;
  }

  async update(id: number, updateExhibitorDto: UpdateExhibitorDto) {
    const exhibitor = await this.exhibitorsRepository.repository.findOneOrFail({
      where: { id }
    });
    const updatedExhibitor: Exhibitor = {
      ...exhibitor,
      ...updateExhibitorDto,
      updatedAt: new Date(),
    }
    await this.exhibitorsRepository.repository.update(id, updatedExhibitor);
    return updatedExhibitor;
  }

  async remove(id: number) {
    this.exhibitorsRepository.repository.softDelete(id);
    return null;
  }

  async setStands(id: number, asignStandsDto: AssignStandsDto) {
    const { standIds } = asignStandsDto;
    const exhibitor = await this.findOne(id);
    const stands = await this.standsRepository.repository.find({
      where: {
        id: In(standIds)
      }
    });
    exhibitor.stands = stands;
    await this.exhibitorsRepository.repository.save(exhibitor);
    return this.findOne(id);
  }
}

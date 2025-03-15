import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePressReleaseDto } from './dto/create-press-release.dto';
import { UpdatePressReleaseDto } from './dto/update-press-release.dto';
import { PressRelease } from '../domain/entities/press-release.entity';
import { PressReleasesRepository } from '../domain/repositories/press-releases.repository';

@Injectable()
export class PressReleasesService {

  constructor(
    private readonly pressReleasesRepository: PressReleasesRepository
  ) { }

  async create(createPressReleaseDto: CreatePressReleaseDto) {
    const { date } = createPressReleaseDto;
    const pressRelease: PressRelease = {
      ...createPressReleaseDto,
      date: date ? new Date(date) : null,
      createdAt: new Date(),
    }
    const createdRelease = await this.pressReleasesRepository.repository.save(pressRelease);
    return createdRelease;
  }

  async findAll({onlyActive} = {onlyActive: false}) {
    let where = {};
    if(onlyActive){
      where = { isActive: true };
    }
    const pressReleases = await this.pressReleasesRepository.repository.find({
      where
    });
    return pressReleases;
  }

  async findOne(id: number) {
    const pressRelease = await this.pressReleasesRepository.repository.findOne({
      where: {
        id
      }
    });
    if (!pressRelease) {
      throw new NotFoundException('Press release not found');
    }
    return pressRelease;
  }

  async update(id: number, updatePressReleaseDto: UpdatePressReleaseDto) {
    const pressRelease = await this.findOne(id);
    const updatedPressRelease = {
      ...pressRelease,
      ...updatePressReleaseDto,
      updatedAt: new Date(),
    }
    await this.pressReleasesRepository.repository.update(id, updatedPressRelease);
    return updatedPressRelease;
  }

  async remove(id: number) {
    this.pressReleasesRepository.repository.softDelete(id);
    return null;
  }
}

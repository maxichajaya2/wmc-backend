import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePavilionDto } from './dto/create-pavilion.dto';
import { UpdatePavilionDto } from './dto/update-pavilion.dto';
import { PavilionsRepository } from '../domain/repositories/pavilions.repository';
import { Pavilion } from './entities/pavilion.entity';

@Injectable()
export class PavilionsService {
  constructor(
      private readonly pavilionsRepository: PavilionsRepository
    ) { }
  
    async create(createPavilionsDto: CreatePavilionDto) {
      const pavilion: Pavilion = {
        ...createPavilionsDto,
        createdAt: new Date(),
      }
      const createdPavilion = await this.pavilionsRepository.repository.save(pavilion);
      return createdPavilion;
    }
  
    async findAll({onlyActive} = {onlyActive: false}) {
      let where = {};
      if(onlyActive){
        where = { isActive: true };
      }
      const pavilions = await this.pavilionsRepository.repository.find({
        where
      });
      return pavilions;
    }
  
    async findOne(id: number) {
      const pavilion = await this.pavilionsRepository.repository.findOne({
        where: {
          id
        }
      });
      if (!pavilion) {
        throw new NotFoundException('Press release not found');
      }
      return pavilion;
    }
  
    async update(id: number, updatePavilionDto: UpdatePavilionDto) {
      const pavilion = await this.findOne(id);
      const updatedPavilion = {
        ...pavilion,
        ...updatePavilionDto,
        updatedAt: new Date(),
      }
      await this.pavilionsRepository.repository.update(id, updatedPavilion);
      return updatedPavilion;
    }
  
    async remove(id: number) {
      this.pavilionsRepository.repository.softDelete(id);
      return null;
    }
}

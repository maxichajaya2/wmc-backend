import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStandDto } from './dto/create-stand.dto';
import { UpdateStandDto } from './dto/update-stand.dto';
import { StandsRepository } from '../domain/repositories/stands.repository';
import { PavilionsRepository } from '../domain/repositories/pavilions.repository';
import { ExhibitorsRepository } from '../domain/repositories/exhibitors.repository';
import { Stand } from '../domain/entities/stand.entity';

@Injectable()
export class StandsService {
  constructor(
      private readonly standsRepository: StandsRepository,
      private readonly pavilionsRepository: PavilionsRepository,
      private readonly exhibitorsRepository: ExhibitorsRepository,
    ) {}
  
    async create(createStandDto: CreateStandDto) {
      const { pavilionId, exhibitorId } = createStandDto;
      const pavilion = await this.pavilionsRepository.repository.findOne({
        where: {
          id: pavilionId,
        }
      });
      if(!pavilion) {
        throw new NotFoundException('Pavilion not found');
      }
      if(exhibitorId){
        const exhibitor = await this.exhibitorsRepository.repository.findOne({
          where: {
            id: exhibitorId,
          }
        });
        if(!exhibitor) {
          throw new NotFoundException('Exhibitor not found');
        }
      }
      const stand: Stand = {
        ...createStandDto,
        pavilion,
        createdAt: new Date(),
      }
      return this.standsRepository.repository.save(stand);
    }
  
    async findAll({onlyActive} = {onlyActive: false}) {
      let where = {};
      if(onlyActive){
        where = { isActive: true };
      }
      return this.standsRepository.repository.find({
        where,
      });
    }
  
    async findOne(id: string | number, {onlyActive} = {onlyActive: false}) {
      let where = {};
      if(onlyActive){
        where['isActive'] = true;
      }
      const idIsNumber = !isNaN(Number(id));
      if(idIsNumber){
        where['id'] = +id;
      } else {
        where['code'] = id;
      }
      const course = await this.standsRepository.repository.findOne({
        where,
      });
      if(!course){
        throw new NotFoundException('Course not found');
      }
      return course;
    }
  
    async update(id: number, updateStandDto: UpdateStandDto) {
        const stand = await this.findOne(id);
        const { pavilionId, exhibitorId } = updateStandDto;
        if(pavilionId && stand.pavilionId !== pavilionId){
          const pavilion = await this.pavilionsRepository.repository.findOne({
            where: { id: pavilionId },
          });
          if(!pavilion){
            throw new NotFoundException('Pavilion not found');
          }
          stand.pavilion = pavilion;
        }
        if(exhibitorId && stand.exhibitorId !== exhibitorId){
          const exhibitor = await this.exhibitorsRepository.repository.findOne({
            where: { id: exhibitorId },
          });
          if(!exhibitor){
            throw new NotFoundException('Exhibitor not found');
          }
          stand.exhibitor = exhibitor;
        }
        const updatedStand = {
          ...stand,
          ...updateStandDto,
          updatedAt: new Date(),
        }
        await this.standsRepository.repository.update(id, updatedStand);
        return updatedStand;
      }
  
      async remove(id: number){
        this.standsRepository.repository.softDelete(id);
        return null;
      }
}

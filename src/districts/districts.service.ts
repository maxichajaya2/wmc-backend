import { BadRequestException, Injectable } from '@nestjs/common';
import { DistrictsRepository } from '../domain/repositories/districts.repository';

@Injectable()
export class DistrictsService {
  
  constructor(
    private readonly districtsRepository: DistrictsRepository
  ){}

  findAll(query: any) {
    const { provinceId } = query;
    if(!provinceId){
      throw new BadRequestException('departmentId is required');
    }
    return this.districtsRepository.repository.find({
      where: {
        provinceId
      }
    })
  }
}

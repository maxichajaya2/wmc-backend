import { BadRequestException, Injectable } from '@nestjs/common';
import { ProvincesRepository } from '../domain/repositories/provinces.repository';

@Injectable()
export class ProvincesService {
  
  constructor(
    private readonly provincesRepository: ProvincesRepository
  ){}

  findAll(query: any) {
    const { departmentId } = query;
    if(!departmentId){
      throw new BadRequestException('departmentId is required');
    }
    return this.provincesRepository.repository.find({
      where: {
        departmentId
      }
    })
  }
}

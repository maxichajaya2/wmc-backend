import { Injectable } from '@nestjs/common';
import { CreateParameterDto } from './dto/create-parameter.dto';
import { UpdateParameterDto } from './dto/update-parameter.dto';
import { ParametersRepository } from '../domain/repositories/parameters.repository';

@Injectable()
export class ParametersService {

  constructor(
    private readonly parametersRepository: ParametersRepository,
  ) { }

  async create(createParameterDto: CreateParameterDto) {
    const { code, value } = createParameterDto;
    const row = await this.parametersRepository.repository.findOne({ 
      where: { code }
     }); 
     if(!row){
      return this.parametersRepository.repository.save({ code, value });
     } else {
      row.value = value;
      return this.parametersRepository.repository.save(row);
     }
  }

  findAll() {
    return this.parametersRepository.repository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} parameter`;
  }

  update(id: number, updateParameterDto: UpdateParameterDto) {
    return `This action updates a #${id} parameter`;
  }

  remove(id: number) {
    return `This action removes a #${id} parameter`;
  }
}

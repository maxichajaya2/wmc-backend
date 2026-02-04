import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Abstract } from '../entities/abstract.entity';

@Injectable()
export class AbstractRepository {
  constructor(
    @InjectRepository(Abstract)
    public readonly repository: Repository<Abstract>,
  ) {}
  
  findByEmail(email: string) {
    return this.repository.find({
      where: { email }
    });
  }

  async findByEmailRegister(email: string) {
    return await this.repository.findOne({
      where: { email: email }
    });
  }
}

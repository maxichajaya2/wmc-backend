import { Injectable } from '@nestjs/common';
import { DepartmentsRepository } from '../domain/repositories/departments.repository';

@Injectable()
export class DepartmentsService {
  constructor(
    private readonly departmentsRepository: DepartmentsRepository
  ) {}

  findAll() {
    return this.departmentsRepository.repository.find();
  }
}

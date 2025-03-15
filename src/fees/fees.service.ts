import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeeDto } from './dto/create-fee.dto';
import { UpdateFeeDto } from './dto/update-fee.dto';
import { FeesRepository } from '../domain/repositories/fees.repository';
import { CoursesRepository } from '../domain/repositories/courses.repository';
import { Course } from '../domain/entities/course.entity';
import { Fee } from '../domain/entities/fee.entity';

@Injectable()
export class FeesService {

  constructor(
    private readonly feesRepository: FeesRepository,
    private readonly coursesRepository: CoursesRepository,
  ) {}

  async findAll({onlyActive} = {onlyActive: false}) {
      let where = {};
      if(onlyActive){
        where = { isActive: true };
      }
      return this.feesRepository.repository.find({
        where,
      });
    }
  
    async findOne(id: number, {onlyActive} = {onlyActive: false}) {
      let where = { id };
      if(onlyActive){
        where['isActive'] = true;
      }
      const fee = await this.feesRepository.repository.findOne({
        where,
      });
      if(!fee){
        throw new NotFoundException('Fee not found');
      }
      return fee;
    }
  
    async create(createFeeDto: CreateFeeDto) {
      const { courseId } = createFeeDto;
      const course = await this.coursesRepository.repository.findOne({
        where: { id: courseId },
      });
      if(!course){
        throw new NotFoundException('Course not found');
      }
      const fee: Fee = {
        ...createFeeDto,
        createdAt: new Date(),
        course,
      }
      return this.feesRepository.repository.save(fee);
    }
  
    async update(id: number, updateFeeDto: UpdateFeeDto) {
      const fee = await this.findOne(id);
      const { courseId } = updateFeeDto;
      if(courseId && fee.courseId !== courseId){
        const course = await this.coursesRepository.repository.findOne({
          where: { id: courseId },
        });
        if(!course){
          throw new NotFoundException('Course not found');
        }
        fee.course = course;
      }
      const updatedPaper = {
        ...fee,
        ...updateFeeDto,
        updatedAt: new Date(),
      }
      await this.feesRepository.repository.update(id, updatedPaper);
      return updatedPaper;
    }
  
    async remove(id: number){
      this.feesRepository.repository.softDelete(id);
      return null;
    }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CoursesRepository } from '../domain/repositories/courses.repository';
import { Course } from '../domain/entities/course.entity';
import { ConferenceTypesRepository } from '../domain/repositories/conference-types.repository';

@Injectable()
export class CoursesService {

  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly conferenceTypeRepository: ConferenceTypesRepository,
  ) {}

  async validateUniqueCode(code: string){
    const course = await this.coursesRepository.repository.findOne({
      where: { 
        code,
        deletedAt: null,
      },
    });
    if(course){
      throw new BadRequestException({
        code: 'CODE_ALREADY_EXISTS',
        message: 'Course code already exists'
      });
    }
  }

  async create(createCourseDto: CreateCourseDto) {
    const { conferenceTypeId, code } = createCourseDto;
    await this.validateUniqueCode(code);
    const conferenceType = await this.conferenceTypeRepository.repository.findOne({
      where: {
        id: conferenceTypeId,
      }
    });
    if(!conferenceType) {
      throw new NotFoundException('Conference type not found');
    }
    const course: Course = {
      ...createCourseDto,
      conferenceType,
      createdAt: new Date(),
    }
    console.log({course});
    return this.coursesRepository.repository.save(course);
  }

  async findAll({onlyActive} = {onlyActive: false}) {
    let where = {};
    if(onlyActive){
      where = { isActive: true };
    }
    return this.coursesRepository.repository.find({
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
    const course = await this.coursesRepository.repository.findOne({
      where,
    });
    if(!course){
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
      const course = await this.findOne(id);
      const { conferenceTypeId, code } = updateCourseDto;
      if(code && course.code !== code){
        await this.validateUniqueCode(code);
      }
      if(conferenceTypeId && course.conferenceTypeId !== conferenceTypeId){
        const conferenceType = await this.conferenceTypeRepository.repository.findOne({
          where: { id: conferenceTypeId },
        });
        if(!conferenceType){
          throw new NotFoundException('Conference type not found');
        }
        course.conferenceType = conferenceType;
      }
      const updatedCourse = {
        ...course,
        ...updateCourseDto,
        updatedAt: new Date(),
      }
      await this.coursesRepository.repository.update(id, updatedCourse);
      return updatedCourse;
    }

    async remove(id: number){
      this.coursesRepository.repository.softDelete(id);
      return null;
    }

    async getFees(id: string){
      const isNumber = !isNaN(Number(id));
      const course = await this.coursesRepository.repository.findOne({
        where: [
          { id: isNumber ? +id : 0 },
          { code: id },
        ],
        relations: ['fees'],
      });
      if(!course){
        throw new NotFoundException('Course not found');
      }
      return course.fees;
    }
}
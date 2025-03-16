import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesRepository } from '../domain/repositories/categories.repository';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {

  constructor(
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
      const category: Category = {
        ...createCategoryDto,
      }
      return this.categoriesRepository.repository.save(category);
    }
  
    async findAll({onlyActive} = {onlyActive: false}) {
      let where = {};
      if(onlyActive){
        where = { isActive: true };
      }
      return this.categoriesRepository.repository.find({
        where,
      });
    }
  
    async findOne(id: number) {
      let where = {
        id,
      };
      const category = await this.categoriesRepository.repository.findOne({
        where,
      });
      if(!category){
        throw new NotFoundException('Category not found');
      }
      return category;
    }
  
    async update(id: number, updateCategoryDto: UpdateCategoryDto) {
        const category = await this.findOne(id);
        const updatedCourse = {
          ...category,
          ...updateCategoryDto,
          updatedAt: new Date(),
        }
        await this.categoriesRepository.repository.update(id, updatedCourse);
        return updatedCourse;
      }
  
      async remove(id: number){
        this.categoriesRepository.repository.softDelete(id);
        return null;
      }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PagesRepository } from '../domain/repositories/pages.repository';
import { Page } from '../domain/entities/page.entity';
import { url } from 'inspector';
import { In } from 'typeorm';

@Injectable()
export class PagesService {

  constructor(
    private readonly pagesRepository: PagesRepository,
  ) { }

  create(createPageDto: CreatePageDto) {
    const page: Page = {
      ...createPageDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    return this.pagesRepository.repository.save(page);
  }

  findAll({short, onlyActive, keys}: {short: boolean, onlyActive: boolean, keys: string}) {
    let where = {};
    
    if(onlyActive){
      where = {
        isActive: true
      };
    }
    if(short){
      return this.pagesRepository.repository.find({
        select: ['id', 'titleEs', 'titleEn'],
        where
      });
    }
    if(keys){
      const keyArray = keys.split(',');
      where = [
        { urlKeyEs: In(keyArray), ...where },
        { urlKeyEn: In(keyArray), ...where }
      ]
    }
    console.log({where})
    return this.pagesRepository.repository.find({
      where
    });
  }

  async findOne(id: number, { onlyActive } = { onlyActive: false }) {
    let where = { id };
    if(onlyActive){
      where['isActive'] = true;
    }
    const page = await this.pagesRepository.repository.findOne({
      where,
    });
    if (!page) {
      throw new NotFoundException('Page not found');
    }
    return page;
  }

  async update(id: number, updatePageDto: UpdatePageDto) {
    const page = await this.findOne(id);
    const updatedPage = {
      ...page,
      ...updatePageDto,
      updatedAt: new Date(),
    }
    return this.pagesRepository.repository.save(updatedPage);
  }

  async remove(id: number) {
    await this.pagesRepository.repository.softDelete(id);
    return null;
  }
}

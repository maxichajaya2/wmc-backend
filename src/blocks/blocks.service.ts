import { Injectable, NotFoundException } from '@nestjs/common';
import { ContentFilters, BlocksRepository } from '../domain/repositories/blocks.repository';
import { In } from 'typeorm';
import { CreateBlockDto } from './dto/create-block.dto';
import { Block } from '../domain/entities/block.entity';
import { UpdateBlockDto } from './dto/update-block.dto';

@Injectable()
export class BlocksService {

  constructor(
    private readonly blocksRepository: BlocksRepository
  ) {}

  async findAll(filters: ContentFilters) {
    console.log('filters', filters);
    const { keys, onlyActive } = filters;
    let where = {};
    if(onlyActive === 'true'){
      where = {
        isActive: true
      };
    }
    if (keys) {
      const keysArray = keys.split(',');
      where = {
        urlKey: In(keysArray)
      };
    }
    const items = await this.blocksRepository.repository.find({
      where
    });
    if(keys){
      return items.reduce((acc, item) => {
        acc[item.urlKey] = item;
        return acc;
      }, {});
    }
    return items;
  }

  async findOne(id: number, { onlyActive } = { onlyActive: false }) {
    const where = { id };
    if(onlyActive){
      where['isActive'] = true;
    }  
    const block = await this.blocksRepository.repository.findOne({
      where
    });
    if (!block) {
      throw new NotFoundException('Block not found');
    }
    return block;
  }

  create(createBlockDto: CreateBlockDto){
    console.log('createBlockDto', createBlockDto);
    const block: Block = {
      ...createBlockDto,
      createdAt: new Date(),
    }
    return this.blocksRepository.repository.save(block);
  }

  async update(id: number, updateBlockDto: UpdateBlockDto) {
    console.log('updateBlockDto', updateBlockDto);
    const block = await this.findOne(id);
    const updatedBlock = await this.blocksRepository.repository.save({
      ...block,
      ...updateBlockDto
    });
    return updatedBlock;
  }

  async remove(id: number) {
    await this.blocksRepository.repository.softDelete(id);
    return null;
  }
}

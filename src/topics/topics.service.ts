import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TopicsRepository } from '../domain/repositories/topics.repository';
import { CreateTopicDto } from './dto/create-topic.dto';
import { Topic } from '../domain/entities/topic.entity';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { WebUsersRepository } from '../domain/repositories/web-users.repository';
import { WebUserType } from '../domain/entities/web-user.entity';
import { CategoriesRepository } from '../domain/repositories/categories.repository';

@Injectable()
export class TopicsService {

  constructor(
    private readonly topicsRepository: TopicsRepository,
    private readonly webUsersRepository: WebUsersRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) { }

  findAll({ onlyActive } = { onlyActive: false }) {
    const where = {};
    if (onlyActive) {
      where['isActive'] = true;
    }
    return this.topicsRepository.repository.find({
      where
    });
  }

  async findOne(id: number, { onlyActive } = { onlyActive: false }) {
    const where = { id };
    if (onlyActive) {
      where['isActive'] = true;
    }
    const topic = await this.topicsRepository.repository.findOne({
      where
    });
    if (!topic) {
      throw new NotFoundException(`Topic #${id} not found`);
    }
    return topic;
  }

  async create(createTopicDto: CreateTopicDto) {
    const { categoryId } = createTopicDto;
    const category = await this.categoriesRepository.repository.findOne({
      where: { id: categoryId }
    });
    if (!category) {
      throw new NotFoundException(`Category #${categoryId} not found`);
    }
    const topic: Topic = {
      ...createTopicDto,
      category,
      createdAt: new Date()
    }
    return this.topicsRepository.repository.save(topic);
  }

  async update(id: number, updateTopicDto: UpdateTopicDto) {
    const { categoryId } = updateTopicDto;
    const topic = await this.findOne(id);
    const updatedTopic: Topic = {
      ...topic,
      ...updateTopicDto,
      updatedAt: new Date()
    }
    if (categoryId && categoryId !== topic.categoryId) {
      const category = await this.categoriesRepository.repository.findOne({
        where: { id: categoryId }
      });
      if (!category) {
        throw new NotFoundException(`Category #${categoryId} not found`);
      }
      updatedTopic.category = category;
    }
    return this.topicsRepository.repository.save(updatedTopic);
  }

  async remove(id: number) {
    await this.topicsRepository.repository.softDelete(id);
    return null;
  }

  async addUser(id: number, userId: number) {
    const topic = await this.topicsRepository.repository.findOne({
      where: { id },
      relations: ['users']
    });
    if (!topic) {
      throw new NotFoundException(`Topic #${id} not found`);
    }
    const user = await this.webUsersRepository.findById(userId);
    if (topic.users.some(u => u.id === user.id)) {
      throw new BadRequestException({
        code: 'USER_ALREADY_ADDED',
        message: 'User is already added to the topic'
      });
    }
    if (user.type !== WebUserType.REVIEWER) {
      throw new BadRequestException({
        code: 'INVALID_USER_TYPE',
        message: 'Only reviewers can be added to topics'
      });
    }
    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    topic.users.push(user);
    return this.topicsRepository.repository.save(topic);
  }

  async removeUser(id: number, userId: number) {
    const topic = await this.topicsRepository.repository.findOne({
      where: { id },
      relations: ['users']
    });
    if (!topic) {
      throw new NotFoundException(`Topic #${id} not found`);
    }
    const user = await this.webUsersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    topic.users = topic.users.filter(u => u.id !== user.id);
    return this.topicsRepository.repository.save(topic);
  }

  async getUsers(id: number) {
    const topic = await this.topicsRepository.repository.findOne({
      where: { id },
      relations: ['users']
    });
    if (!topic) {
      throw new NotFoundException(`Topic #${id} not found`);
    }
    return topic.users;
  }
}

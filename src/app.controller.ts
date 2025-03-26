import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CountriesService } from './common/services/countries.service';
import { SendContactEmailDto } from './common/dtos/send-contact-email.dto';
import { categoriesAndTopicsSeed } from './domain/seeds/seeds';
import { Category } from './domain/entities/category.entity';
import { Topic } from './domain/entities/topic.entity';
import { CategoriesRepository } from './domain/repositories/categories.repository';
import { TopicsRepository } from './domain/repositories/topics.repository';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly countriesService: CountriesService,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly topicsRepository: TopicsRepository,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('countries')
  getCountries() {
    return this.countriesService.findAll();
  }

  @Post('send-contact-email')
  sendContactEmail(@Body() sendContactEmailDto: SendContactEmailDto) {
    return this.appService.sendContactEmail(sendContactEmailDto);
  }

  @Post('seed')
  async seed() {
    const entries = Object.entries(categoriesAndTopicsSeed);
    for (const [categoryName, topicNames] of entries) {
      console.log(`Inserting ${categoryName}`);
      const category: Category = {
        name: categoryName,
        createdAt: new Date(),
      };
      const categoryCreated = await this.categoriesRepository.repository.save(category);
      for (const topicName of topicNames) {
        console.log(`Inserting ${topicName}`);
        const topic: Topic = {
          name: topicName,
          category: categoryCreated,
          createdAt: new Date(),
        }
        await this.topicsRepository.repository.save(topic);
      }
    }
    return 1;
  }
}

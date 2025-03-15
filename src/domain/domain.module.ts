import { Global, Module } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { RolesRepository } from './repositories/roles.repository';
import { Permission } from './entities/permission.entity';
import { PermissionsRepository } from './repositories/permissions.repository';
import { WebUsersRepository } from './repositories/web-users.repository';
import { WebUser } from './entities/web-user.entity';
import { TopicsRepository } from './repositories/topics.repository';
import { PapersRepository } from './repositories/papers.repository';
import { Topic } from './entities/topic.entity';
import { Paper } from './entities/paper.entity';
import { UsersService } from '../users/users.service';
import { PaperComentary } from './entities/paper-comentary.entity';
import { PaperCommentsRepository } from './repositories/papers-comments.repository';
import { DepartmentsRepository } from './repositories/departments.repository';
import { ProvincesRepository } from './repositories/provinces.repository';
import { DistrictsRepository } from './repositories/districts.repository';
import { Department } from './entities/department.entity';
import { Province } from './entities/province.entity';
import { District } from './entities/district.entity';
import { PaperAuthor } from './entities/paper-author.entity';
import { PaperAuthorsRepository } from './repositories/paper-authors.repository';
import { Category } from './entities/category.entity';
import { CategoriesRepository } from './repositories/categories.repository';

export const APP_ENTITIES = [
  User,
  Role,
  Permission,
  WebUser,
  Paper,
  Topic,
  Paper,
  PaperComentary,
  Department,
  Province,
  District,
  PaperAuthor,
  Category
];

@Global()
@Module({
  providers: [
    RolesRepository,
    PermissionsRepository,
    UsersRepository,
    WebUsersRepository,
    TopicsRepository,
    PapersRepository,
    UsersService,
    PaperCommentsRepository,
    DepartmentsRepository,
    ProvincesRepository,
    DistrictsRepository,
    PaperAuthorsRepository,
    CategoriesRepository,
  ],
  exports: [
    UsersRepository,
    RolesRepository,
    PermissionsRepository,
    WebUsersRepository,
    TopicsRepository,
    PapersRepository,
    UsersService,
    ConfigModule,
    PaperCommentsRepository,
    DepartmentsRepository,
    ProvincesRepository,
    DistrictsRepository,
    PaperAuthorsRepository,
    CategoriesRepository,
  ],
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: APP_ENTITIES,
        synchronize: true,
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        cli: {
          migrationsDir: 'src/domain/migrations',
        },
      })
    }),
    TypeOrmModule.forFeature(APP_ENTITIES),
  ],
})
export class DomainModule { }
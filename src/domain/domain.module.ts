import { Global, Module } from '@nestjs/common';
import { MenusRepository } from './repositories/menus.repository';
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
import { PagesRepository } from './repositories/pages.repository';
import { BlocksRepository } from './repositories/blocks.repository';
import { GalleriesRepository } from './repositories/gallery.repository';
import { GalleryImagesRepository } from './repositories/gallery-image.repository';
import { TopicsRepository } from './repositories/topics.repository';
import { PapersRepository } from './repositories/papers.repository';
import { Topic } from './entities/topic.entity';
import { Paper } from './entities/paper.entity';
import { UsersService } from '../users/users.service';
import { PaperComentary } from './entities/paper-comentary.entity';
import { PaperCommentsRepository } from './repositories/papers-comments.repository';
import { ConferenceTypesRepository } from './repositories/conference-types.repository';
import { SpeakerTypesRepository } from './repositories/speaker-types.repository';
import { RoomsRepository } from './repositories/rooms.repository';
import { ConferencesRepository } from './repositories/conferences.repository';
import { SpeakersRepository } from './repositories/speakers.repository';
import { ConferenceSpeakersRepository } from './repositories/conference-speakers.repository';
import { DepartmentsRepository } from './repositories/departments.repository';
import { ProvincesRepository } from './repositories/provinces.repository';
import { FeesRepository } from './repositories/fees.repository';
import { EnrollmentsRepository } from './repositories/enrollments.repository';
import { CoursesRepository } from './repositories/courses.repository';
import { DistrictsRepository } from './repositories/districts.repository';
import { Department } from './entities/department.entity';
import { Province } from './entities/province.entity';
import { District } from './entities/district.entity';
import { PressReleasesRepository } from './repositories/press-releases.repository';
import { ExhibitorsRepository } from './repositories/exhibitors.repository';
import { PavilionsRepository } from './repositories/pavilions.repository';
import { StandsRepository } from './repositories/stands.repository';
import { PaperAuthor } from './entities/paper-author.entity';
import { PaperAuthorsRepository } from './repositories/paper-authors.repository';

@Global()
@Module({
  providers: [
    MenusRepository,
    RolesRepository,
    PermissionsRepository,
    UsersRepository,
    WebUsersRepository,
    PagesRepository,
    BlocksRepository,
    GalleriesRepository,
    GalleryImagesRepository,
    TopicsRepository,
    PapersRepository,
    UsersService,
    PaperCommentsRepository,
    SpeakerTypesRepository,
    RoomsRepository,
    ConferenceTypesRepository,
    ConferencesRepository,
    SpeakersRepository,
    ConferenceSpeakersRepository,
    DepartmentsRepository,
    ProvincesRepository,
    DistrictsRepository,
    FeesRepository,
    EnrollmentsRepository,
    CoursesRepository,
    PressReleasesRepository,
    ExhibitorsRepository,
    PavilionsRepository,
    StandsRepository,
    PaperAuthorsRepository,
  ],
  exports: [
    MenusRepository,
    UsersRepository,
    RolesRepository,
    PermissionsRepository,
    WebUsersRepository,
    PagesRepository,
    BlocksRepository,
    GalleriesRepository,
    GalleryImagesRepository,
    TopicsRepository,
    PapersRepository,
    UsersService,
    ConfigModule,
    PaperCommentsRepository,
    ConferenceTypesRepository,
    SpeakerTypesRepository,
    RoomsRepository,
    ConferencesRepository,
    SpeakersRepository,
    ConferenceSpeakersRepository,
    DepartmentsRepository,
    ProvincesRepository,
    DistrictsRepository,
    FeesRepository,
    EnrollmentsRepository,
    CoursesRepository,
    PressReleasesRepository,
    ExhibitorsRepository,
    PavilionsRepository,
    StandsRepository,
    PaperAuthorsRepository,
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
        entities: [
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
        ],
        synchronize: false,
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        cli: {
          migrationsDir: 'src/domain/migrations',
        },
      })
    }),
    TypeOrmModule.forFeature([
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
    ]),
  ],
})
export class DomainModule { }

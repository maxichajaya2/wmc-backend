import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DomainModule } from './domain/domain.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PapersModule } from './papers/papers.module';
import { TopicsModule } from './topics/topics.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { WebUsersModule } from './web-users/web-users.module';
import { ProvincesModule } from './provinces/provinces.module';
import { DistrictsModule } from './districts/districts.module';
import { DepartmentsModule } from './departments/departments.module';
import { FilesModule } from './files/files.module';
import { CategoriesModule } from './categories/categories.module';
import { ParametersModule } from './parameters/parameters.module';
import { ReportsModule } from './reports/reports.module';
import { Abstract } from './domain/entities/abstract.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DomainModule,
    CommonModule,
    AuthModule,
    // MenusModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    WebUsersModule,
    Abstract,
    // PagesModule,
    // BlocksModule,
    // GalleryModule,
    PapersModule,
    TopicsModule,
    // RoomsModule,
    // ConferenceTypesModule,
    // SpeakerTypesModule,
    // ConferencesModule,
    // SpeakersModule,
    DepartmentsModule,
    ProvincesModule,
    DistrictsModule,
    // CoursesModule,
    // FeesModule,
    // EnrollmentsModule,
    // PressReleasesModule,
    // ExhibitorsModule,
    // PavilionsModule,
    // StandsModule,
    FilesModule,
    CategoriesModule,
    ParametersModule,
    ReportsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
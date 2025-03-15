import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DomainModule } from './domain/domain.module';
import { MenusModule } from './menus/menus.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { BlocksModule } from './blocks/blocks.module';
import { UsersModule } from './users/users.module';
import { GalleryModule } from './gallery/gallery.module';
import { PapersModule } from './papers/papers.module';
import { TopicsModule } from './topics/topics.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { WebUsersModule } from './web-users/web-users.module';
import { PagesModule } from './pages/pages.module';
import { RoomsModule } from './rooms/rooms.module';
import { ConferenceTypesModule } from './conference-types/conference-types.module';
import { SpeakerTypesModule } from './speaker-types/speaker-types.module';
import { ConferencesModule } from './conferences/conferences.module';
import { SpeakersModule } from './speakers/speakers.module';
import { ProvincesModule } from './provinces/provinces.module';
import { DistrictsModule } from './districts/districts.module';
import { DepartmentsModule } from './departments/departments.module';
import { CoursesModule } from './courses/courses.module';
import { FeesModule } from './fees/fees.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { PressReleasesModule } from './press-releases/press-releases.module';
import { ExhibitorsModule } from './exhibitors/exhibitors.module';
import { PavilionsModule } from './pavilions/pavilions.module';
import { StandsModule } from './stands/stands.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DomainModule,
    CommonModule,
    AuthModule,
    MenusModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    WebUsersModule,
    PagesModule,
    BlocksModule,
    GalleryModule,
    PapersModule,
    TopicsModule,
    RoomsModule,
    ConferenceTypesModule,
    SpeakerTypesModule,
    ConferencesModule,
    SpeakersModule,
    DepartmentsModule,
    ProvincesModule,
    DistrictsModule,
    CoursesModule,
    FeesModule,
    EnrollmentsModule,
    PressReleasesModule,
    ExhibitorsModule,
    PavilionsModule,
    StandsModule,
    FilesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
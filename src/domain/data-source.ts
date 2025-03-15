
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { Page } from './entities/page.entity';
import { Menu } from './entities/menu.entity';
import { Permission } from './entities/permission.entity';
import { WebUser } from './entities/web-user.entity';
import { Paper } from './entities/paper.entity';
import { Gallery, GalleryImage } from './entities/gallery.entity';
import { Topic } from './entities/topic.entity';
import { PaperComentary } from './entities/paper-comentary.entity';
import { Block } from './entities/block.entity';
import { Room } from './entities/room.entity';
import { ConferenceType } from './entities/conference-type.entity';
import { SpeakerType } from './entities/speaker-type.entity';
import { Conference } from './entities/conference.entity';
import { Speaker } from './entities/speaker.entity';
import { ConferenceSpeaker } from './entities/conference-speakers.entity';
import { Department } from './entities/department.entity';
import { Province } from './entities/province.entity';
import { District } from './entities/district.entity';
import { Fee } from './entities/fee.entity';
import { Enrollment } from './entities/enrollment.entity';
import { Course } from './entities/course.entity';
import { PressRelease } from './entities/press-release.entity';
import { Exhibitor } from './entities/exhibitor.entity';
import { Pavilion } from './entities/pavilion.entity';
import { Stand } from './entities/stand.entity';
import { PaperAuthor } from './entities/paper-author.entity';

config(); // Carga las variables de entorno

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
        Role,
        User,
        Page,
        Menu,
        Permission,
        WebUser,
        Paper,
        Gallery,
        GalleryImage,
        Topic,
        PaperComentary,
        Block,
        Room,
        ConferenceType,
        SpeakerType,
        Conference,
        Speaker,
        ConferenceSpeaker,
        Department,
        Province,
        District,
        Fee,
        Enrollment,
        Course,
        PressRelease,
        Exhibitor,
        Pavilion,
        Stand,
        PaperAuthor,
    ],
    synchronize: false,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
});




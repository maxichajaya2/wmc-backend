
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { APP_ENTITIES } from './domain.module';

config(); // Carga las variables de entorno

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: APP_ENTITIES,
    synchronize: false,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
});




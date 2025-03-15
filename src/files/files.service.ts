import { BadRequestException, Injectable } from '@nestjs/common';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class FilesService {
  storagePath = process.env.STORAGE_PATH || 'static/multimedia';

  getStaticFile(imageName: string) {

    const path = join(__dirname, `../../${this.storagePath}`, imageName);
    console.log({path});
    if (!existsSync(path))
      throw new BadRequestException(`No product found with image ${imageName}`);

    return path;
  }
}

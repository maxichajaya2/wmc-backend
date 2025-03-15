import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Get, Res, Param } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helper';
import { Response } from 'express';
const dotenv = require('dotenv');
dotenv.config();

const STORAGE_PATH = process.env.STORAGE_PATH || 'static/multimedia';
console.log({STORAGE_PATH});

@Controller('files')
export class FilesController {

  hostApi = process.env.HOST_URL;

  constructor(
    private readonly filesService: FilesService
  ) { }

  @Get(':name')
  findProductImage(
    @Res() res: Response,
    @Param('name') name: string
  ) {
    const path = this.filesService.getStaticFile(name);
    console.log({path});
    res.sendFile(path);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    //fileFilter: fileFilter,
    // limits: { fileSize: 1000 }
    storage: diskStorage({
      destination: STORAGE_PATH,
      filename: fileNamer
    })
  }))
  uploadProductImage(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }
    // const secureUrl = `${ file.filename }`;
    const url = `${this.hostApi}/api/files/${file.filename}`;
    return { url };
  }
}

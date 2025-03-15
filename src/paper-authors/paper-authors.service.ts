import { Injectable } from '@nestjs/common';
import { CreatePaperAuthorDto } from './dto/create-paper-author.dto';
import { UpdatePaperAuthorDto } from './dto/update-paper-author.dto';

@Injectable()
export class PaperAuthorsService {
  create(createPaperAuthorDto: CreatePaperAuthorDto) {
    return 'This action adds a new paperAuthor';
  }

  findAll() {
    return `This action returns all paperAuthors`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paperAuthor`;
  }

  update(id: number, updatePaperAuthorDto: UpdatePaperAuthorDto) {
    return `This action updates a #${id} paperAuthor`;
  }

  remove(id: number) {
    return `This action removes a #${id} paperAuthor`;
  }
}

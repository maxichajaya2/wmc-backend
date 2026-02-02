import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AbstractsService } from './abstracts.service';
import { CreateAbstractDto } from './dto/create-abstract.dto';
import { UpdateAbstractDto } from './dto/update-abstract.dto';

@Controller('abstracts')
export class AbstractsController {
  constructor(private readonly abstractsService: AbstractsService) {}

  @Get()
  findAll() {
    return this.abstractsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.abstractsService.findOne(+id);
  }

  @Post()
  create(@Body() createAbstractDto: CreateAbstractDto) {
    return this.abstractsService.create(createAbstractDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAbstractDto: UpdateAbstractDto,
  ) {
    return this.abstractsService.update(+id, updateAbstractDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.abstractsService.remove(+id);
  }

  @Get('validate')
  validateField(@Query('field') field: string, @Query('value') value: string) {
    return this.abstractsService.validateField(field, value);
  }
}

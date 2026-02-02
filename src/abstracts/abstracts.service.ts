import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AbstractRepository } from '../domain/repositories/abstract.repository';
import { CreateAbstractDto } from './dto/create-abstract.dto';
import { Abstract } from '../domain/entities/abstract.entity';
import { UpdateAbstractDto } from './dto/update-abstract.dto';
import { WebUserType } from '../domain/entities/web-user.entity';
import { Not } from 'typeorm';

@Injectable()
export class AbstractsService {
  constructor(private readonly abstractsRepository: AbstractRepository) {}

  // findAll() {
  //   return this.abstractsRepository.repository.find();
  // }

  findAll() {
    return this.abstractsRepository.repository.find({
      order: { codigo: 'ASC' },
    });
  }

  async findOne(id: number) {
    const where = { id };
    const abstract = await this.abstractsRepository.repository.findOne({
      where,
    });
    if (!abstract) {
      throw new NotFoundException(`Abstract #${id} not found`);
    }
    return abstract;
  }

  async create(createAbstractDto: CreateAbstractDto) {
    // Validar código duplicado
    const existsCode = await this.abstractsRepository.repository.findOne({
      where: { codigo: createAbstractDto.codigo },
    });
    if (existsCode) {
      throw new BadRequestException({
        code: 'CODE_EXISTS',
        message: 'El código ya está registrado',
      });
    }

    // Validar email duplicado
    // const existsEmail = await this.abstractsRepository.repository.findOne({
    //   where: { email: createAbstractDto.email },
    // });
    // if (existsEmail) {
    //   throw new BadRequestException({
    //     code: 'EMAIL_EXISTS',
    //     message: 'El correo electrónico ya está registrado',
    //   });
    // }

    // Validar título duplicado
    // const existsTitle = await this.abstractsRepository.repository.findOne({
    //   where: { title: createAbstractDto.title },
    // });
    // if (existsTitle) {
    //   throw new BadRequestException({
    //     code: 'TITLE_EXISTS',
    //     message: 'El título ya está registrado',
    //   });
    // }
    return this.abstractsRepository.repository.save(createAbstractDto);
  }

  async update(id: number, updateAbstractDto: UpdateAbstractDto) {
    const abstract = await this.findOne(id);
    const updatedAbstract: Abstract = { ...abstract, ...updateAbstractDto };
    // Código duplicado
    const existsCode = await this.abstractsRepository.repository.findOne({
      where: { codigo: updateAbstractDto.codigo, id: Not(id) },
    });
    if (existsCode) {
      throw new BadRequestException({
        code: 'CODE_EXISTS',
        message: 'El código ya está registrado por otro abstract',
      });
    }

    // Email duplicado
    // const existsEmail = await this.abstractsRepository.repository.findOne({
    //   where: { email: updateAbstractDto.email, id: Not(id) },
    // });
    // if (existsEmail) {
    //   throw new BadRequestException({
    //     code: 'EMAIL_EXISTS',
    //     message: 'El correo electrónico ya está registrado por otro abstract',
    //   });
    // }

    // Título duplicado
    // const existsTitle = await this.abstractsRepository.repository.findOne({
    //   where: { title: updateAbstractDto.title, id: Not(id) },
    // });
    // if (existsTitle) {
    //   throw new BadRequestException({
    //     code: 'TITLE_EXISTS',
    //     message: 'El título ya está registrado por otro abstract',
    //   });
    // }

    return this.abstractsRepository.repository.save(updatedAbstract);
  }

  // async remove(id: number) {
  //   await this.abstractsRepository.repository.softDelete(id);
  //   return null;
  // }

  async remove(id: number) {
    return await this.abstractsRepository.repository.delete(id); // <--- Esto funciona siempre
  }

  async validateField(field: string, value: string) {
    const exists = await this.abstractsRepository.repository.findOne({
      where: { [field]: value },
    });

    return { exists: !!exists };
  }
}

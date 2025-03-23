import { Injectable } from '@nestjs/common';
import { PapersRepository } from '../domain/repositories/papers.repository';

import { Workbook } from 'exceljs';
import { paperStateMap, paperTypeMap } from '../domain/entities/paper.entity';
import { paperAuthorTypeMap } from '../domain/entities/paper-author.entity';

@Injectable()
export class ReportsService {

  constructor(
    private readonly papersRepository: PapersRepository,
  ){}

  async getPapersReport() {
    const papers = await this.papersRepository.repository.find({
      relations: ['webUser', 'category', 'topic', 'authors'],
    });

    const mappedPapers = papers.map((paper, index) => {
      const { category, topic, title, language, keywords, eventWhere, eventDate, type, state, authors } = paper;
      const { name: categoryName } = category;
      const { name: topicName } = topic;
      const phase = paperTypeMap[type];
      const stateName = paperStateMap[state];

      return {
        number: index,
        category: categoryName,
        topic: topicName,
        title,
        language,
        keyWords: keywords.join(', '),
        eventWhere,
        eventDate,
        phase,
        state: stateName,
        authors: authors.map(author => {
          const { name, middle, last, remissive, institution, cellphone, email, type } = author;
          const fullName = `${name} ${middle} ${last}`;
          const typeName = paperAuthorTypeMap[type];
          return {
            name: fullName,
            remissive,
            institution,
            cellphone,
            email,
            type: typeName,
          }
        })
      }
    });

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('trabajos-técnicos');

    // Definir las columnas
    worksheet.columns = [
      { header: 'ID', key: 'id' },
      { header: 'Nombre', key: 'name' },
      { header: 'Edad', key: 'age' },
    ];

    // Agregar datos
    worksheet.addRow({ id: 1, name: 'Juan Pérez', age: 25 });
    worksheet.addRow({ id: 2, name: 'María López', age: 30 });

    // Estilo para la cabecera
    worksheet.getRow(1).font = { bold: true };

    // Generar y devolver el buffer del archivo
    return workbook.xlsx.writeBuffer();
  }
}

import { Injectable } from '@nestjs/common';
import { PapersRepository } from '../domain/repositories/papers.repository';

import { Workbook } from 'exceljs';
import { paperStateMap, paperTypeMap } from '../domain/entities/paper.entity';
import { paperAuthorTypeMap } from '../domain/entities/paper-author.entity';

@Injectable()
export class ReportsService {

  constructor(
    private readonly papersRepository: PapersRepository,
  ) { }

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
        number: index + 1,
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

    console.log(JSON.stringify(mappedPapers));

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('trabajos-técnicos');

    // Definir las columnas
    worksheet.columns = [
      { header: 'NUMERO', key: 'number' },
      { header: 'CATEGORIA', key: 'category' },
      { header: 'TEMA', key: 'topic' },
      { header: 'TITULO', key: 'title' },
      { header: 'IDIOMA', key: 'language' },
      { header: 'PALABRAS CLAVES', key: 'keyWords' },
      { header: 'DONDE', key: 'eventWhere' },
      { header: 'FECHA', key: 'eventDate' },
      { header: 'FASE', key: 'phase' },
      { header: 'ESTADO', key: 'state' },
    ];

    const authorColumns = [
      { header: 'Nombre Completo', key: 'name' },
      { header: 'Cargo', key: 'remissive' },
      { header: 'Empresa', key: 'institution' },
      { header: 'Celular', key: 'cellphone' },
      { header: 'Email', key: 'email' },
      { header: 'Tipo', key: 'type' },
    ];

    for (let index = 0; index < 2; index++) {
      const ac = authorColumns.map(({ header, key }) => ({ header: `${header} ${index + 1}`, key: `${key}${index + 1}` }));
      worksheet.columns = [...worksheet.columns, ...ac];
    }

    for (const rowData of mappedPapers) {
      const { authors, ...rest } = rowData;
      const row = {
        id: rowData.number,
        ...rest,
      };
      authors.forEach((author, index) => {
        const { name, remissive, institution, cellphone, email, type } = author;
        row[`name${index + 1}`] = name;
        row[`remissive${index + 1}`] = remissive;
        row[`institution${index + 1}`] = institution;
        row[`cellphone${index + 1}`] = cellphone;
        row[`email${index + 1}`] = email;
        row[`type${index + 1}`] = type;
      }
      );
      worksheet.addRow(row);
    }

    // Estilo para la cabecera
    // worksheet.getRow(1).font = { bold: true };

    // worksheet.addRow([
    //   { value: 'J', merged: true }, { value: 'K', merged: true }, { value: 'L', merged: true },
    //   { value: 'M', merged: true }, { value: 'N', merged: true }, { value: 'O', merged: true },
    //   { value: 'P', merged: true }, { value: 'Q', merged: true }, { value: 'R', merged: true },
    //   { value: 'S', merged: true }, { value: 'T', merged: true }, { value: 'U', merged: true },
    //   { value: 'V', merged: true }, { value: 'X', merged: true }, { value: 'Y', merged: true },
    //   { value: 'Z', merged: true }, { value: 'AA', merged: true }
    // ]);
    
    // worksheet.addRow([
    //   'HYOHA', 'HYOHA PRESUECCON', 'HYOHA SUECCON/FAKE', 'ESTADO', 'TIPO SUECONARIO',
    //   'NOVABRE CON CARGO', 'DAPRESA', 'CELULAR', 'BANAL', 'TIPO', 'NOVABRE CON CARGO',
    //   'DAPRESA', 'CELULAR', 'BANAL', 'TIPO'
    // ]);
    
    // // Combinar celdas para la primera fila
    // worksheet.mergeCells('A1:Q1');

    // Generar y devolver el buffer del archivo
    return workbook.xlsx.writeBuffer();
  }
}

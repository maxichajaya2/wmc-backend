import { Injectable } from '@nestjs/common';
import { PapersRepository } from '../domain/repositories/papers.repository';

import { Style, Workbook } from 'exceljs';
import {
  PaperState,
  paperStateMap,
  paperTypeMap,
  Process,
  processMap,
} from '../domain/entities/paper.entity';
import {
  PaperAuthorType,
  paperAuthorTypeMap,
} from '../domain/entities/paper-author.entity';
import { MoreThanOrEqual, Raw } from 'typeorm';


@Injectable()
export class ReportsService {
  constructor(private readonly papersRepository: PapersRepository) {}

  async getPapersReport(filters: {
    state?: PaperState;
    reviewerUserId?: number;
    leaderId?: number;
    topicId?: number;
    categoryId?: number;
    process?: Process;
    startDate?: string;
    endDate?: string;
  }) {
    const where: any = {};
    // siempre excluimos los state con PaperState.REGISTERED
    where.state = MoreThanOrEqual(PaperState.RECEIVED);
    if (filters.state) where.state = filters.state;
    if (filters.reviewerUserId) where.reviewerUserId = filters.reviewerUserId;
    if (filters.leaderId) where.leaderId = filters.leaderId;
    if (filters.topicId) where.topicId = filters.topicId;
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.process) where.process = filters.process;

    if (filters.startDate || filters.endDate) {
      const { startDate, endDate } = filters;
      if (startDate && endDate) {
        where.createdAt = Raw(
          (alias) => `DATE(${alias}) BETWEEN '${startDate}' AND '${endDate}'`,
        );
      } else if (startDate) {
        where.createdAt = Raw((alias) => `DATE(${alias}) >= '${startDate}'`);
      } else if (endDate) {
        where.createdAt = Raw((alias) => `DATE(${alias}) <= '${endDate}'`);
      }
    }
    const papers = await this.papersRepository.repository.find({
      where,
      relations: ['webUser', 'category', 'topic', 'authors', 'leader'],
    });

    const mappedPapers = papers
      .map((paper, index) => {
        const {
          correlative,
          category,
          topic,
          title,
          file,
          industry,
          // language,
          keywords,
          eventWhere,
          eventDate,
          eventWhich,
          process,
          type,
          state,
          agreeTerms, 
          authors,
          receivedDate,
          approvedDate,
          selectedApprovedDate,
          phase1Score,
          phase2Score,
          leader,
          reviewerUser,
          
        } = paper;
        const { name: categoryName } = category ?? { name: 'Sin Categoria' };
        const { name: topicName } = topic ?? { name: 'Sin Tema' };
        const phase = processMap[process];
        const typePaper = paperTypeMap[type];
        const stateName = paperStateMap[state];

        return {
          number: index + 1,
          correlative,
          category: categoryName,
          topic: topicName,
          title,
          // language,
          keyWords: keywords.join(', '),
          eventWhere,
          eventDate,
          eventWhich,
          industry,
          agreeTerms,
          phase,
          typePaper,
          receivedDate,
          approvedDate,
          selectedApprovedDate,
          leader: leader ? `${leader.name}` : '--',
          reviewer: reviewerUser ? `${reviewerUser.name}` : '--',
          state: stateName,
          phase1Score: phase1Score ?? '--',
          phase2Score: phase2Score ?? '--',
          fileUrl: file ?? '', // si `file` ya viene como URL completa
          authors: authors
            .sort((a, b) => {
              if (
                a.type === PaperAuthorType.AUTOR &&
                b.type !== PaperAuthorType.AUTOR
              )
                return -1;
              if (
                a.type !== PaperAuthorType.AUTOR &&
                b.type === PaperAuthorType.AUTOR
              )
                return 1;
              return 0;
            })
            .map((author) => {
              const {
                name,
                middle,
                last,
                remissive,
                institution,
                cellphone,
                countryCode,
                address,
                city,
                state,
                email,
                type,
              } = author;
              const fullName = `${name} ${middle}`;
              const typeName = paperAuthorTypeMap[type];
              return {
                name: fullName,
                remissive,
                institution,
                cellphone,
                email,
                countryCode,
                address,
                city,
                state,
                type: typeName,
              };
            }),
        };
      })
      .sort((a, b) => {
        const numA = parseInt(a.correlative.match(/\d+/)[0], 10);
        const numB = parseInt(b.correlative.match(/\d+/)[0], 10);
        return numA - numB;
      });

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Trabajos Técnicos');

    // Estilo para el título principal
    const titleStyle: Partial<Style> = {
      font: {
        bold: true,
        size: 24,
        color: { argb: 'FF000000' },
      },
      alignment: {
        vertical: 'middle',
        horizontal: 'center',
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0AFF96' },
      },
    };
    // Estilo para los headers de autor
    const headerAuthorStyle: Partial<Style> = {
      font: {
        bold: true,
        color: { argb: 'FFFFFFFF' },
        size: 14,
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2860FF' },
      },
      alignment: {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    };
    // Estilo para los headers
    const headerStyle: Partial<Style> = {
      font: {
        bold: true,
        color: { argb: 'FFFFFFFF' },
        size: 12,
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4F81BD' },
      },
      alignment: {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    };

    // Estilo para los datos
    const dataStyle: Partial<Style> = {
      font: {
        size: 11,
      },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
      alignment: {
        wrapText: true,
      },
    };

    // Agregar título principal en la primera fila
    worksheet.addRow(['REPORTE DE TRABAJOS TÉCNICOS']);
    worksheet.addRow(['']);

    // Definir columnas principales
    const mainColumns = [
      { header: 'N°', key: 'number', width: 5 },
      { header: 'CORRELATIVO', key: 'correlative', width: 5 },
      { header: 'CATEGORÍA', key: 'category', width: 20 },
      { header: 'TEMA', key: 'topic', width: 20 },
      { header: 'TÍTULO', key: 'title', width: 30 },
      // { header: 'IDIOMA', key: 'language', width: 10 },
      { header: 'PALABRAS CLAVES', key: 'keyWords', width: 25 },
      { header: 'EVENTO (LUGAR)', key: 'eventWhich', width: 20 },
      { header: 'EVENTO (DONDE)', key: 'eventWhere', width: 20 },
      { header: 'EVENTO (FECHA)', key: 'eventDate', width: 15 },
      { header: 'URL DOCUMENTO', key: 'fileUrl', width: 40 },
      { header: 'TIPO INDUSTRIA', key: 'industry', width: 20 },
      { header: 'ACEPTO CONDICIONES', key: 'agreeTerms', width: 20 },
      // Agregar lider y revisor
      { header: 'LÍDER', key: 'leader', width: 20 },
      { header: 'REVISOR', key: 'reviewer', width: 20 },
      { header: 'FECHA', key: 'receivedDate', width: 15 },
      { header: 'FECHA PRESELECCION', key: 'approvedDate', width: 15 },
      { header: 'FECHA SELECCIÓN', key: 'selectedApprovedDate', width: 15 },
      { header: 'FASE', key: 'phase', width: 15 },
      { header: 'PUNTAJE FASE 1', key: 'phase1Score', width: 10 },
      { header: 'PUNTAJE FASE 2', key: 'phase2Score', width: 10 },
      { header: 'ESTADO', key: 'state', width: 15 },
      { header: 'TIPO SELECCIONADO', key: 'typePaper', width: 15 },
    ];
    // Determinar el número máximo de autores en los datos
    const maxAuthors = Math.max(
      ...mappedPapers.map((p) => p.authors.length),
      3,
    );
    const authorColumns = [];
    for (let i = 1; i <= 3; i++) {
      authorColumns.push(
        { header: `AUTOR ${i} (NOMBRE)`, key: `name${i}`, width: 25 },
        { header: `AUTOR ${i} (CARGO)`, key: `remissive${i}`, width: 20 },
        { header: `AUTOR ${i} (EMPRESA)`, key: `institution${i}`, width: 20 },
        { header: `AUTOR ${i} (CELULAR)`, key: `cellphone${i}`, width: 15 },
        { header: `AUTOR ${i} (EMAIL)`, key: `email${i}`, width: 25 },
        { header: `AUTOR ${i} (PAIS)`, key: `countryCode${i}`, width: 15 },
        { header: `AUTOR ${i} (DIRECCION)`, key: `address${i}`, width: 25 },
        { header: `AUTOR ${i} (CIUDAD)`, key: `city${i}`, width: 25 },
        { header: `AUTOR ${i} (ESTADO)`, key: `state${i}`, width: 15 },
      );
    }
    // Combinar todas las columnas
    worksheet.columns = [...mainColumns, ...authorColumns];
    // COMBINAR LA PRIMERA FILA
    worksheet.mergeCells(1, 1, 1, mainColumns.length + maxAuthors * 6);
    // DARLE NOMBRE A LA CELDA COMBINADA
    worksheet.getCell(1, 1).value = 'REPORTE DE TRABAJOS TÉCNICOS';
    worksheet.getCell(1, 1).style = titleStyle;

    // Tercera fila: Headers de autores fusionados
    let colIndex = mainColumns.length + 1; // Inicio de las columnas de autores
    for (let i = 1; i <= maxAuthors; i++) {
      worksheet.mergeCells(3, colIndex, 3, colIndex + 5); // Fusionar celdas para cada autor
      worksheet.getCell(3, colIndex).value = `AUTOR ${i}`;
      worksheet.getCell(3, colIndex).style = headerAuthorStyle;
      // height de la fila
      worksheet.getRow(3).height = 30;
      colIndex += 6; // Saltar 6 columnas para el siguiente autor
    }

    // Agregar Cuarta fila de encabezados (NOMBRE, CARGO, etc.)
    const headerRow2 = worksheet.getRow(4);
    worksheet.columns.forEach((column, i) => {
      headerRow2.getCell(i + 1).value = Array.isArray(column.header)
        ? column.header.join(', ')
        : column.header;
      headerRow2.getCell(i + 1).style = headerStyle;
    });

    // Agregar datos y aplicar estilo
    mappedPapers.forEach((rowData) => {
      const { authors, ...rest } = rowData;
      const row = {
        ...rest,
        eventDate: rowData.eventDate
          ? new Date(rowData.eventDate).toLocaleDateString()
          : '',
      };

      // Mapear autores
      authors.forEach((author, index) => {
        if (index < maxAuthors) {
          // Solo mostramos hasta 3 autores
          row[`name${index + 1}`] = author.name;
          row[`remissive${index + 1}`] = author.remissive;
          row[`institution${index + 1}`] = author.institution;
          row[`cellphone${index + 1}`] = author.cellphone;
          row[`email${index + 1}`] = author.email;
          row[`countryCode${index + 1}`] = author.countryCode;
          row[`address${index + 1}`] = author.address;
          row[`city${index + 1}`] = author.city;
          row[`state${index + 1}`] = author.state;
          row[`type${index + 1}`] = author.type;
        }
      });

      const addedRow = worksheet.addRow(row);
      addedRow.eachCell((cell) => {
        cell.style = dataStyle;
      });
    });

    // Congelar la fila de encabezados
    worksheet.views = [{ state: 'frozen', ySplit: 4 }];

    // Autoajustar el ancho de las columnas basado en el contenido
    /* worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        let columnLength = cell.value ? cell.value.toString().length : 0;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = Math.min(Math.max(maxLength + 2, 10), 50);
    }); */

    return workbook.xlsx.writeBuffer();
  }
}

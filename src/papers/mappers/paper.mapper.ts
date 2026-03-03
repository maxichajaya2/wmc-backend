// import { PaperAuthorType } from "../../domain/entities/paper-author.entity";
// import { Paper } from "../../domain/entities/paper.entity";

// export function paperMapper(p: Paper, { withAuthors = false } = {}): any {
//     const author = p.authors.find(a => a.type === PaperAuthorType.AUTOR);
//     if(!withAuthors) {
//         delete p.authors;
//     }
//     return {
//         ...p,
//         author,
//     };

// }

import { PaperAuthorType } from "../../domain/entities/paper-author.entity";
import { Paper } from "../../domain/entities/paper.entity";

export function paperMapper(p: Paper, { withAuthors = false } = {}): any {
    // 1. Extraemos el autor principal para la vista rápida
    const author = p.authors?.find(a => a.type === PaperAuthorType.AUTOR);

    // 2. Creamos un clon del objeto para no mutar la entidad original de TypeORM
    const paperMapped: any = { ...p };

    // 3. Manejamos la visibilidad de los autores
    if (!withAuthors) {
        delete paperMapped.authors;
    }

    return {
        ...paperMapped,
        author,
        // Aseguramos que los IDs de revisores se envíen explícitamente

        // --- COLUMNAS DE ARCHIVOS Y VERSIONES ---
        file: p.file,                   // Fase 1 actual
        fileVersion1: p.fileVersion1,   // Fase 1 Historial 1
        fileVersion2: p.fileVersion2,   // Fase 1 Historial 2
        
        fullFileUrl: p.fullFileUrl,           // Fase 2 actual
        fullFileVersion1: p.fullFileUrlVersion1, // Fase 2 Historial 1
        fullFileVersion2: p.fullFileUrlVersion2, // Fase 2 Historial 2
        reviewerUserId: p.reviewerUserId,
        reviewerSupport1Id: p.reviewerSupport1Id,
        reviewerSupport2Id: p.reviewerSupport2Id,
        reviewerSupport3Id: p.reviewerSupport3Id,
        
        // Si en el Service haces el join de las relaciones (reviewerUser, reviewerSupport1, etc)
        // podrías enviar también los nombres, pero con los IDs basta para la lógica del Front.
    };
}
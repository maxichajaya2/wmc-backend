import { PaperAuthorType } from "../../domain/entities/paper-author.entity";
import { Paper } from "../../domain/entities/paper.entity";

export function paperMapper(p: Paper, { withAuthors = false } = {}): any {
    const author = p.authors.find(a => a.type === PaperAuthorType.AUTOR);
    if(!withAuthors) {
        delete p.authors;
    }
    return {
        ...p,
        author,
    };

}
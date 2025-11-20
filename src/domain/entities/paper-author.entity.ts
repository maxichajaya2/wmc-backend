import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Paper } from "./paper.entity";

export enum PaperAuthorType {
  AUTOR = 'A',
  COAUTOR = 'C',
}

export const paperAuthorTypeMap = {
  'A': 'AUTOR',
  'C': 'COAUTOR',
}

@Entity()
export class PaperAuthor {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'int', nullable: true })
  paperId?: number;
  
  @ManyToOne(() => Paper, paper => paper.authors, { onDelete: 'CASCADE' })
  paper: Paper;

  @Column({ type: 'varchar', length: 255 })
  type: PaperAuthorType;

  @Column({ type: 'text', nullable: true })
  name?: string;

  @Column({ type: 'text', nullable: true })
  middle?: string | null;

  @Column({ type: 'text', nullable: true })
  last?: string;

  @Column({ type: 'text', nullable: true })
  remissive?: string | null;

  @Column({ type: 'text', nullable: true })
  institution?: string | null;

  @Column({ type: 'text', nullable: true })
  countryCode?: string | null;
  
  @Column({ type: 'text', nullable: true })
  address?: string | null;
  
  @Column({ type: 'text', nullable: true })
  city?: string | null;
 
  @Column({ type: 'text', nullable: true })
  state?: string | null;

  @Column({ type: 'text', nullable: true })
  professionalDesignation?: string | null;


  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  emailCorp?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cellphone?: string;

  @CreateDateColumn({nullable: true})
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
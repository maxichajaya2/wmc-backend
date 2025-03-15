import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Paper } from "./paper.entity";

@Entity()
export class PaperAuthor {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'int', nullable: true })
  paperId?: number;
  
  @ManyToOne(() => Paper, paper => paper.authors, { onDelete: 'CASCADE' })
  paper: Paper;

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
  city?: string | null;

  @Column({ type: 'boolean', default: false })
  flagpotential?: boolean;

  @Column({ type: 'boolean', default: false })
  flagcorrespon?: boolean;

  @Column({ type: 'text', nullable: true })
  email?: string;

  @Column({ type: 'int', nullable: true })
  orden?: number;

  @CreateDateColumn({nullable: true})
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
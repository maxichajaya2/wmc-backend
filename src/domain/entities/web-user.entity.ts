import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { Paper } from './paper.entity';
import { Topic } from './topic.entity';
import { PaperComentary } from './paper-comentary.entity';
import { Enrollment } from './enrollment.entity';

export enum DocumentType {
  NO_DOMICILIADO = '0',
  DNI = '1',
  CE = '4',
  PASSPORT = '7',
  RUC = '6',
  CREDENCIAL_DIPLOMATICA = 'A',
}

export enum WebUserType{
  REVIEWER = 'reviewer',
  USER = 'user',
}

@Entity()
export class WebUser {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({
    type: 'enum',
    enum: DocumentType,
    default: DocumentType.DNI, // Opcional: establece un valor por defecto
    nullable: true, 
  })
  documentType?: DocumentType;

  @Column({ nullable: true })
  documentNumber?: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: WebUserType,
    default: WebUserType.USER,
  })
  type: WebUserType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  // @OneToMany(() => Enrollment, enrollment => enrollment.user)
  // enrollments?: Enrollment[];

  reviewedPapers?: Paper[];

  papers?: Paper[];

  topics?: Topic[];
}

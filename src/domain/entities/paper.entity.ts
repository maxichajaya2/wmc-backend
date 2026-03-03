import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WebUser } from './web-user.entity';
import { User } from './user.entity';
import { Topic } from './topic.entity';
import { PaperComentary } from './paper-comentary.entity';
import { PaperAuthor } from './paper-author.entity';
import { Category } from './category.entity';

export class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

export enum PaperState {
  REGISTERED = 0,
  RECEIVED = 1,
  SENT = 2,
  ASSIGNED = 3,
  UNDER_REVIEW = 4,
  APPROVED = 5,
  DISMISSED = 6,
  OBSERVED = 7,
  SUBSANATED = 8,
}

export const paperStateMap = {
  0: 'REGISTRADO',
  1: 'RECIBIDO',
  2: 'ENVIADO',
  3: 'ASIGNADO',
  4: 'EN REVISIÓN',
  5: 'APROBADO',
  6: 'RECHAZADO',
  7: 'OBSERVADO',
  8: 'SUBSANADO',
};

export enum PaperType {
  ORAL = 'O',
  POSTER = 'P',
  PRESENTACION_INTERACTIVA = 'PI',
  PRESENTACION_ORAL = 'PO',
}

// Define un Enum para mayor seguridad
export enum ReviewerType {
  PRINCIPAL = 'principal',
  APOYO = 'apoyo',
}

export const paperTypeMap = {
  O: 'ORAL',
  P: 'POSTER',
  PI: 'PRESENTACIÓN INTERACTIVA',
  PO: 'PRESENTACIÓN ORAL',
};

export enum Process {
  PRESELECCIONADO = 'P',
  SELECCIONADO = 'S',
}

export const processMap: Record<Process, string> = {
  P: 'FASE 1',
  S: 'FASE 2',
};

@Entity()
export class Paper {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'text', nullable: true })
  title: string | null;

  @Column({ type: 'text', nullable: true })
  resume: string | null;

  @Column({ type: 'text', nullable: true })
  authorBiography: string | null;

  @Column({ type: 'text', nullable: true })
  abstractText: string | null;

  @Column({ type: 'text', nullable: true })
  proposalSignificance: string | null;

  @Column({ type: 'boolean', default: false })
  agreeTerms?: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  industry?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  file?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  copyrightForm?: string | null;

  @Column({ type: 'int' })
  state: PaperState;

  @Column({ type: 'date', nullable: true })
  receivedDate?: Date | null;

  @Column({ type: 'date', nullable: true })
  selectedReceivedDate?: Date | null;

  @Column({ type: 'date', nullable: true })
  sentDate?: Date | null;

  @Column({ type: 'date', nullable: true })
  selectedSentDate?: Date | null;

  @Column({ type: 'date', nullable: true })
  assignedDate?: Date | null;

  @Column({ type: 'date', nullable: true })
  selectedAssignedDate?: Date | null;

  @Column({ type: 'date', nullable: true })
  reviewedDate?: Date | null;

  @Column({ type: 'date', nullable: true })
  selectedReviewedDate?: Date | null;

  @Column({ type: 'date', nullable: true })
  approvedDate?: Date | null;

  @Column({ type: 'date', nullable: true })
  selectedApprovedDate?: Date | null;

  @Column({ type: 'date', nullable: true })
  dismissedDate?: Date | null;

  @Column({ type: 'date', nullable: true })
  selectedDismissedDate?: Date | null;

  @Column({ type: 'int', nullable: true })
  webUserId?: number | null;

  // En tu entidad de asignación

  @ManyToOne(() => WebUser, (user) => user.papers, {
    nullable: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'webUserId' })
  webUser: WebUser;

  @Column({ type: 'int', nullable: true })
  reviewerUserId?: number | null;

  @Column({ type: 'int', nullable: true })
  reviewerSupport1Id?: number | null;

  @Column({ type: 'int', nullable: true })
  reviewerSupport2Id?: number | null;

  @Column({ type: 'int', nullable: true })
  reviewerSupport3Id?: number | null;

  @ManyToOne(() => User, (user) => user.reviewedPapers, {
    nullable: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'reviewerUserId' })
  reviewerUser?: User | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewerSupport1Id' })
  reviewerSupport1?: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewerSupport2Id' })
  reviewerSupport2?: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewerSupport3Id' })
  reviewerSupport3?: User;

  // @Column({ type: 'int' })
  // registeredById: number;

  // @ManyToOne(() => User, (user) => user.registeredPapers, { onDelete: 'CASCADE', nullable: true, eager: true })
  // @JoinColumn({ name: 'registeredById'})
  // registeredBy?: User | null;

  @Column({ type: 'int', nullable: true })
  topicId: number;

  @ManyToOne(() => Topic, (topic) => topic.papers, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'topicId' })
  topic?: Topic;

  @ManyToOne(() => Category, (category) => category.papers, { eager: true })
  category: Category;

  @Column({ type: 'int', nullable: true })
  categoryId?: number;

  @ManyToOne(() => User, (user) => user.ledPapers)
  leader?: User;

  @Column({ type: 'int', nullable: true })
  leaderId?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  language?: string;

  @Column('text', { array: true })
  keywords?: string[];

  @Column({ type: 'boolean', default: false })
  flagEvent?: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  eventWhere?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  eventWhich?: string;

  @Column({ type: 'date', nullable: true })
  eventDate?: Date;

  @Column({ type: 'varchar', length: 5, nullable: true })
  process: Process;

  @Column({ type: 'text', nullable: true })
  fullFileUrl?: string;

  // @Column({ type: 'boolean', default: true })
  // isActive?: boolean;

  @OneToMany(() => PaperComentary, (paperComentary) => paperComentary.paper, {
    onDelete: 'CASCADE',
  })
  comentaries?: PaperComentary[];

  @Column({ type: 'varchar', length: 5, nullable: true })
  type?: PaperType;

  @OneToMany(() => PaperAuthor, (paperAuthor) => paperAuthor.paper, {
    onDelete: 'CASCADE',
  })
  authors?: PaperAuthor[];

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  correlative: string;

  // PHASE 1 CALIFICATIONS
  // Main
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p1_m_impact?: number;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p1_m_quality?: number;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p1_m_innovation?: number;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p1_m_rate?: number;

  // Support 1
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p1_s1_impact?: number;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p1_s1_quality?: number;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p1_s1_innovation?: number;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p1_s1_rate?: number;

  // Support 2
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p1_s2_impact?: number;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p1_s2_quality?: number;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p1_s2_innovation?: number;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p1_s2_rate?: number;

  // Support 3
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p1_s3_impact?: number;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p1_s3_quality?: number;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p1_s3_innovation?: number;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p1_s3_rate?: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  phase1_general_rate?: number;

  // PHASE 2 CALIFICATIONS
  // Main
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p2_m_impact?: number;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p2_m_quality?: number;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p2_m_innovation?: number;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p2_m_rate?: number;

  // Support 1
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p2_s1_impact?: number;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p2_s1_quality?: number;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p2_s1_innovation?: number;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p2_s1_rate?: number;

  // Support 2
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p2_s2_impact?: number;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p2_s2_quality?: number;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p2_s2_innovation?: number;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p2_s2_rate?: number;

  // Support 3
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p2_s3_impact?: number;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p2_s3_quality?: number;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p2_s3_innovation?: number;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  p2_s3_rate?: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  phase2_general_rate?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date | null;
}

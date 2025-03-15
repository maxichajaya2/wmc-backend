import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { DocumentType, WebUser } from "./web-user.entity";
import { User } from "./user.entity";
import { Topic } from "./topic.entity";
import { PaperComentary } from "./paper-comentary.entity";
import { PaperAuthor } from "./paper-author.entity";

export enum PaperState {
  APPROVED = 'approved',
  SENT = 'sent',
  REVIEWED = 'reviewed',
  REGISTERED = 'registered',
}

export enum PaperType{
  ORAL = 'oral',
  POSTER = 'poster',
  LIBRO = 'libro',
}

@Entity()
export class Paper {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  resume: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  file?: string | null;

  @Column({
    type: 'enum',
    enum: PaperState,
    default: PaperState.REGISTERED, // Opcional: establece un valor por defecto
    nullable: false,
  })
  state: PaperState;

  @Column({ type: 'date', nullable: true })
  approvedDate?: Date | null;

  @Column({ type: 'date', nullable: true })
  sentDate?: Date | null;

  @Column({ type: 'date', nullable: true })
  reviewedDate?: Date | null;

  @Column({ type: 'date', nullable: true })
  registeredDate?: Date | null;

  @Column({ type: 'int' })
  registeredById: number;

  @ManyToOne(() => User, (user) => user.registeredPapers, { onDelete: 'CASCADE', nullable: true, eager: true })
  @JoinColumn({ name: 'registeredById'})
  registeredBy?: User | null;

  @Column({ type: 'int', nullable: true })
  reviewerUserId?: number | null;

  @ManyToOne(() => WebUser, (user) => user.reviewedPapers, { nullable: true, onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'reviewerUserId' })
  reviewerUser?: WebUser | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userName?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userLastName?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userEmail?: string | null;

  @Column({
    type: 'enum',
    enum: DocumentType,
    default: DocumentType.DNI, // Opcional: establece un valor por defecto
    nullable: true,
  })
  userDocumentType: DocumentType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userDocumentNumber?: string | null;

  @Column({ type: 'boolean', default: true })
  isActive?: boolean;

  @Column({ type: 'int', nullable: true })
  topicId: number;

  @ManyToOne(() => Topic, (topic) => topic.papers, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'topicId' })
  topic?: Topic;

  @OneToMany(() => PaperComentary, (paperComentary) => paperComentary.paper, { onDelete: 'CASCADE' })
  comentaries?: PaperComentary[];

  @Column({
    type: 'enum',
    enum: PaperType,
    nullable: true,
  })
  type?: PaperType;

  @OneToMany(() => PaperAuthor, (paperAuthor) => paperAuthor.paper, { onDelete: 'CASCADE' })
  authors?: PaperAuthor[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date | null;
}
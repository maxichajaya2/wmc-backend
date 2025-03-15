import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { DocumentType, WebUser } from "./web-user.entity";
import { User } from "./user.entity";
import { Topic } from "./topic.entity";
import { PaperComentary } from "./paper-comentary.entity";
import { PaperAuthor } from "./paper-author.entity";
import { Category } from "./category.entity";

export enum PaperState {
  APPROVED = 3,
  SENT = 1,
  REVIEWED = 2,
  REGISTERED = 0,
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

  @Column({ type: 'int' })
  state: PaperState;

  @Column({ type: 'date', nullable: true })
  approvedDate?: Date | null;

  @Column({ type: 'date', nullable: true })
  sentDate?: Date | null;

  @Column({ type: 'date', nullable: true })
  reviewedDate?: Date | null;

  @Column({ type: 'int', nullable: true })
  webUserId?: number | null;

  @ManyToOne(() => WebUser, (user) => user.papers, { nullable: true, onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'webUserId' })
  webUser: WebUser;

  @Column({ type: 'int', nullable: true })
  reviewerUserId?: number | null;

  @ManyToOne(() => WebUser, (user) => user.reviewedPapers, { nullable: true, onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'reviewerUserId' })
  reviewerUser?: WebUser | null;

  // @Column({ type: 'int' })
  // registeredById: number;

  // @ManyToOne(() => User, (user) => user.registeredPapers, { onDelete: 'CASCADE', nullable: true, eager: true })
  // @JoinColumn({ name: 'registeredById'})
  // registeredBy?: User | null;

  @Column({ type: 'int', nullable: true })
  topicId: number;

  @ManyToOne(() => Topic, (topic) => topic.papers, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'topicId' })
  topic?: Topic;

  @ManyToMany(() => Category, (category) => category.topics)
  category: Category;

  @Column({ type: 'int', nullable: true })
  categoryId?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  language?: string;

  @Column("text", { array: true })
  keywords?: string[];

  @Column({ type: 'boolean', default: false })
  flagEvent?: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  eventWhere?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  eventWhich?: string;

  @Column({ type: 'date', nullable: true })
  eventDate?: Date;

  @Column({ type: 'text', nullable: true })
  process?: string;

  // @Column({ type: 'boolean', default: true })
  // isActive?: boolean;

  @OneToMany(() => PaperComentary, (paperComentary) => paperComentary.paper, { onDelete: 'CASCADE' })
  comentaries?: PaperComentary[];

  @Column({ type: 'varchar', length: 255, nullable: true })
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
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne } from 'typeorm';
import { Page } from './page.entity';

@Entity() 
export class Menu {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 255 })
  titleEs: string;

  @Column({ type: 'varchar', length: 255 })
  titleEn: string;

  @Column({ type: 'int', nullable: true })
  parentId?: number | null;

  @Column({ type: 'int', nullable: true })
  sort: number | null;

  @Column({ type: 'boolean', default: false })
  isExternalUrl: boolean;
  
  @Column({ type: 'varchar', length: 255, default: '#', nullable: true })
  url: string;

  @Column({ type: 'int', nullable: true })
  pageId?: number | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', nullable: true })
  createdUserId: number | null;

  @Column({ type: 'int', nullable: true })
  updatedUserId?: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  icon?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date | null;

  // Relación con el padre (Menús jerárquicos)
  @ManyToOne(() => Menu, (menu) => menu.children, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentId' })
  parent?: Menu;

  // Relación con Page (uno a uno, opcional)
  @ManyToOne(() => Page, (page) => page.menus, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pageId' })
  page?: Page | null;

  // Relación inversa (opcional, si quieres recuperar submenús desde el padre)
  children?: Menu[];
}

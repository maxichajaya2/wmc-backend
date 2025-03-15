import { Column, Entity, PrimaryGeneratedColumn, OneToOne, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Menu } from './menu.entity';

@Entity()
export class Page {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 255 })
  titleEn: string;

  @Column({ type: 'varchar', length: 255 })
  titleEs: string;

  @Column({ type: 'varchar', length: 255 })
  urlKeyEn: string;

  @Column({ type: 'varchar', length: 255 })
  urlKeyEs: string;

  @Column({ type: 'text', nullable: true })
  contentEn: string;

  @Column({ type: 'text', nullable: true })
  contentEs: string;

  @Column({ type: 'text', nullable: true })
  decriptionEn: string;

  @Column({ type: 'text', nullable: true })
  decriptionEs: string;

  @Column({ default: true })
  isActive: boolean;

  // Relación inversa con Menu
  @OneToMany(() => Menu, (menu) => menu.page, { nullable: true })
  menus?: Menu | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date | null;
}
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Block {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 255 })
  urlKey: string;

  @Column({ type: 'text', nullable: true })
  titleEn: string;

  @Column({ type: 'text', nullable: true })
  titleEs: string;

  @Column({ type: 'text', nullable: true })
  contentEn?: string | null;

  @Column({ type: 'text', nullable: true })
  contentEs?: string | null;

  @Column({ type: 'boolean', default: true })
  isActive?: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date | null;
}
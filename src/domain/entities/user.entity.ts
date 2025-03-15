import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn, ManyToMany } from 'typeorm';
import { Role } from './role.entity';
import { Paper } from './paper.entity';
import { Category } from './category.entity';
import { PaperComentary } from './paper-comentary.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  registeredPapers?: Paper[];

  @ManyToMany(() => Category, (category) => category.topics)
  category: Category;

  @Column({ type: 'int', nullable: true })
  categoryId?: number;

  reviewedPapers?: Paper[];

  paperComentaries?: PaperComentary[];
}

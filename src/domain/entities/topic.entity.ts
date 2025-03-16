import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Paper } from "./paper.entity";
import { WebUser } from "./web-user.entity";
import { Category } from "./category.entity";

@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'boolean', default: true })
  isActive?: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date | null;

  papers?: Paper[];

  @ManyToMany(() => WebUser, (user) => user.topics)
  @JoinTable({
    name: 'topic_users', // Nombre de la tabla intermedia
    joinColumn: { name: 'topicId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'webUserId', referencedColumnName: 'id' },
  })
  users?: WebUser[];

  @Column({ type: 'int', nullable: true })
  categoryId?: number;

  @ManyToOne(() => Category, (category) => category.users, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}

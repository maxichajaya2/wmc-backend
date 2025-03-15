import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Paper } from "./paper.entity";
import { User } from "./user.entity";

@Entity()
export class PaperComentary{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'text', nullable: true })
    comentary?: string;

    @Column({ type: 'text', nullable: true })
    fileUrl?: string;

    @Column({ type: 'int' })
    userId?: number;

    @ManyToOne(() => User, (user) => user.paperComentaries, { onDelete: 'CASCADE', nullable: false, eager: true })
    @JoinColumn({ name: 'reviewerId' })
    user?: User;

    @Column({ type: 'int' })
    paperId?: number;

    @ManyToOne(() => Paper, (paper) => paper.comentaries, { onDelete: 'CASCADE', nullable: false, eager: true })
    @JoinColumn({ name: 'paperId' })
    paper?: Paper;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
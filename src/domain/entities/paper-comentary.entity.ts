import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { WebUser } from "./web-user.entity";
import { Paper } from "./paper.entity";

@Entity()
export class PaperComentary{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'text', nullable: true })
    comentary: string;

    @Column({ type: 'int' })
    reviewerId?: number;

    @ManyToOne(() => WebUser, (webUser) => webUser.paperComentaries, { onDelete: 'CASCADE', nullable: false, eager: true })
    @JoinColumn({ name: 'reviewerId' })
    reviewer?: WebUser;

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
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Course } from "./course.entity";

export enum Currency {
    PEN = 'pen',
    USD = 'usd'
}

@Entity()
export class Fee {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'int', nullable: true })
    courseId?: number;

    @ManyToOne(() => Course, { nullable: true, onDelete: 'CASCADE', eager: true })
    course?: Course | null;

    @Column({ type: 'text', nullable: true })
    nameEs: string;

    @Column({ type: 'text', nullable: true })
    nameEn: string;

    @Column({ type: 'boolean', default: false })
    memberFlag?: boolean;

    @Column({ type: 'date', nullable: true })
    startDate?: Date;

    @Column({ type: 'date', nullable: true })
    endDate?: Date;

    @Column({ type: 'enum', enum: Currency, default: Currency.PEN })
    currency: Currency;

    @Column({ type: 'decimal', nullable: true })
    amount: number;

    @Column({ type: 'text', nullable: true })
    noteEs?: string | null;

    @Column({ type: 'text', nullable: true })
    noteEn?: string | null;

    @Column({ type: 'boolean', nullable: true, default: false })
    flagFile?: boolean;

    @Column({ type: 'varchar', nullable: true, length: 255 })
    sieCode?: string | null;

    @Column({ type: 'boolean', default: true })
    isActive?: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @DeleteDateColumn()
    deletedAt?: Date;   
}
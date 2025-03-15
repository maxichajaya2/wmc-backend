import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ConferenceType } from "./conference-type.entity";
import { Fee } from "./fee.entity";

@Entity()
export class Course{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'text', nullable: true })
    nameEs: string;

    @Column({ type: 'text', nullable: true })
    nameEn: string;

    @Column({ type: 'varchar', unique: true, nullable: true })
    code?: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'int', nullable: true })
    conferenceTypeId?: number;

    @ManyToOne(() => ConferenceType, { nullable: true, onDelete: 'CASCADE', eager: true })
    conferenceType: ConferenceType | null;

    @OneToMany(() => Fee, fee => fee.course)
    fees?: Fee[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({ nullable: true })
    updatedAt?: Date | null;
    
    @DeleteDateColumn({ nullable: true })
    deletedAt?: Date | null;
}
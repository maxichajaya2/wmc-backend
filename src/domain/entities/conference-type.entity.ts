import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class ConferenceType {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'text', nullable: true })
    nameEn: string;
    
    @Column({ type: 'text', nullable: true })
    nameEs: string;

    @Column({ type: 'boolean', default: true })
    isActive?: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
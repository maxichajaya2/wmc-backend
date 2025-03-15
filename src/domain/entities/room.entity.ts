import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Conference } from './conference.entity';

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'varchar', length: 100 })
    nameEn: string;
    
    @Column({ type: 'varchar', length: 100 })
    nameEs: string;

    @Column({ type: 'boolean', default: true })
    isActive?: boolean;

    conferences?: Conference[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
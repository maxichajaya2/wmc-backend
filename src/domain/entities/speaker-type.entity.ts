import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Speaker } from './speaker.entity';

@Entity()
export class SpeakerType {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'varchar', length: 100 })
    nameEn: string;
    
    @Column({ type: 'varchar', length: 100 })
    nameEs: string;

    @Column({ type: 'boolean', default: true })
    isActive?: boolean;

    speakers?: Speaker[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Pavilion{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({type: 'text', nullable: true})
    nameEs: string;

    @Column({type: 'text', nullable: true})
    nameEn: string;

    @Column({type: 'boolean', default: true})
    isActive?: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
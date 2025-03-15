import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exhibitor } from "./exhibitor.entity";
import { Pavilion } from "./pavilion.entity";

@Entity()
export class Stand{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({type: 'text'})
    name: string;

    @Column({type: 'int', nullable: true})
    positionX?: number;

    @Column({type: 'int', nullable: true})
    positionY?: number;

    @Column({type: 'int', nullable: true})
    exhibitorId?: number;

    @ManyToOne(() => Exhibitor, {eager: true, nullable: true})
    @JoinColumn({name: 'exhibitorId'})
    exhibitor?: Exhibitor;

    @Column({type: 'int', nullable: true})
    pavilionId?: number;

    @ManyToOne(() => Pavilion, {eager: true, nullable: true})
    @JoinColumn({name: 'pavilionId'})
    pavilion: Pavilion;

    @Column({type: 'boolean', nullable: true})
    isActive?: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
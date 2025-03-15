import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Stand } from "./stand.entity";

@Entity()
export class Exhibitor{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({type: 'text', nullable: true})
    ruc: string;

    @Column({type: 'text'})
    enterprise: string;

    @Column({type: 'text', nullable: true})
    web?: string;

    @Column({type: 'boolean', default: true})
    isActive?: boolean;

    @OneToMany(() => Stand, stand => stand.exhibitor)
    stands?: Stand[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum PressReleaseType{
    NOTA_PRENSA = 'N',
    BOLETIN = 'B',
    ENTREVISTA = 'E',
}

@Entity()
export class PressRelease{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({type: 'enum', enum: PressReleaseType})
    type: PressReleaseType;

    @Column({type: 'text'})
    titleEs: string;

    @Column({type: 'text'})
    titleEn: string;

    @Column({type: 'date', nullable: true})
    date?: Date;

    @Column({type: 'text', nullable: true})
    photo?: string;
    
    @Column({type: 'text', nullable: true})
    textEs?: string;

    @Column({type: 'text', nullable: true})
    textEn?: string;

    @Column({type: 'text', nullable: true})
    video?: string;

    @Column({type: 'boolean', default: true})
    isActive?: boolean;

    @Column({type: 'text', nullable: true})
    subtitleEs?: string;

    @Column({type: 'text', nullable: true})
    subtitleEn?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
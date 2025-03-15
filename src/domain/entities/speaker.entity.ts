import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SpeakerType } from "./speaker-type.entity";
import { Conference } from "./conference.entity";
import { ConferenceSpeaker } from "./conference-speakers.entity";

@Entity()
export class Speaker{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'int', nullable: true })
    speakerTypeId?: number;

    @ManyToOne(() => SpeakerType, speakerType => speakerType.speakers, {eager: true})
    @JoinColumn({ name: 'speakerTypeId' })
    speakerType?: SpeakerType;

    @Column({ type: 'text', nullable: true })
    name?: string;

    @Column({ type: 'text', nullable: true })
    jobEn?: string;

    @Column({ type: 'text', nullable: true })
    jobEs?: string;

    @Column({ type: 'text', nullable: true })
    cvEs?: string;

    @Column({ type: 'text', nullable: true })
    cvEn?: string;

    @Column({ type: 'text', nullable: true })
    photoUrl?: string;

    @Column({ type: 'varchar', nullable: true })
    countryCode?: string;

    country?: any;

    @Column({ type: 'boolean' })
    isActive?: boolean;

    @OneToMany(() => ConferenceSpeaker, (conferenceSpeaker) => conferenceSpeaker.speaker)
    conferenceSpeakers?: ConferenceSpeaker[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
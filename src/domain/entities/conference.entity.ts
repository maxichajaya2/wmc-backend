import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Room } from "./room.entity";
import { Speaker } from "./speaker.entity";
import { ConferenceSpeaker } from "./conference-speakers.entity";

@Entity()
export class Conference{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({type: 'text'})
    nameEn: string;

    @Column({type: 'text'})
    nameEs: string;

    @Column({type: 'timestamp'})
    startDate: Date;

    @Column({type: 'timestamp'})
    endDate: Date;

    @Column({type: 'int'})
    roomId: number;

    @ManyToOne(() => Room, (room) => room.conferences, {eager: true})
    @JoinColumn({ name: 'roomId' })
    room: Room;

    @Column({type: 'text', nullable: true})
    resumeEn?: string;

    @Column({type: 'text', nullable: true})
    resumeEs?: string;

    @Column({type: 'text', nullable: true})
    liveLink?: string;

    @Column({type: 'text', nullable: true})
    liveImage?: string;

    @Column({type: 'text', nullable: true})
    googleLink?: string;

    @Column({type: 'text', nullable: true})
    outlookLink?: string;

    @Column({type: 'text', nullable: true})
    calendarLink?: string;

    @Column({type: 'boolean', default: true})
    isActive?: boolean;

    @OneToMany(() => ConferenceSpeaker, (conferenceSpeaker) => conferenceSpeaker.conference, {eager: true})
    conferenceSpeakers?: ConferenceSpeaker[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
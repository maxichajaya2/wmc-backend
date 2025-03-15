import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Conference } from './conference.entity';
import { Speaker } from './speaker.entity';
import { SpeakerType } from './speaker-type.entity';

@Entity('conference_speakers')
export class ConferenceSpeaker {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Conference, (conference) => conference.conferenceSpeakers, { onDelete: 'CASCADE' })
    conference: Conference;

    @Column({ type: 'int' })
    conferenceId?: number;

    @ManyToOne(() => Speaker, (speaker) => speaker.conferenceSpeakers, { onDelete: 'CASCADE', eager: true })
    speaker: Speaker;

    @Column({ type: 'int' })
    speakerId?: number;

    @ManyToOne(() => SpeakerType, {eager: true})
    speakerType: SpeakerType;

    @Column({ type: 'int' })
    speakerTypeId?: number;
}

import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum GalleryType {
    SLIDER = 'slider',
    CARRUSEL = 'carrusel',
    BANNER = 'banner',
    STATIC = 'static',
}

export enum GallerySize{
    SMALL = 'small',
    MEDIUM = 'medium',
    LARGE = 'large',
}

@Entity()

export class Gallery {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'varchar', length: 255 })
    urlKey: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    titleEn?: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    titleEs?: string | null;

    @Column({ type: 'text', nullable: true })
    contentEn?: string | null;

    @Column({ type: 'text', nullable: true })
    contentEs?: string | null;

    @Column({ type: 'text', nullable: true })
    descriptionEn?: string | null;

    @Column({ type: 'text', nullable: true })
    descriptionEs?: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true})
    size?: GallerySize;

    @Column({ type: 'boolean', default: true })
    isActive?: boolean;

    @Column({ type: 'varchar', length: 255 })
    type: GalleryType;

    @OneToMany(() => GalleryImage, (image) => image.gallery)
    images?: GalleryImage[];

    @Column({ type: 'timestamp', nullable: true })
    startDate?: Date | null;

    @Column({ type: 'timestamp', nullable: true })
    endDate?: Date | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    url?: string;

    @Column({ type: 'boolean', default: false })
    isTargetBlank?: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @DeleteDateColumn()
    deletedAt?: Date | null;
}

@Entity()
export class GalleryImage {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'int' })
    galleryId?: number;

    @ManyToOne(() => Gallery, (gallery) => gallery.images)
    @JoinColumn({ name: 'galleryId' })
    gallery?: Gallery;

    @Column({ type: 'int' })
    sort: number;

    @Column({ type: 'text', nullable: true })
    valueEn: string;

    @Column({ type: 'text', nullable: true })
    valueEs: string;

    @Column({ type: 'int', nullable: true })
    fileSizeEs?: number;

    @Column({ type: 'int', nullable: true })
    fileSizeEn?: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    urlEn?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    urlEs?: string;

    @Column({ type: 'boolean', default: false })
    isTargetBlank?: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @DeleteDateColumn()
    deletedAt?: Date | null;
}
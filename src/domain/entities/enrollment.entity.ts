import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { DocumentType, WebUser } from "./web-user.entity";
import { District } from "./district.entity";
import { Province } from "./province.entity";
import { Department } from "./department.entity";
import { Fee } from "./fee.entity";

export enum PaymentMethod{
    DEPOSIT = 'deposit',
    VISA = 'visa',
}

export enum PaymentStatus{
    SUCCESS = 1,
    PENDING = 2,
    REJECTED = 0,
}

export enum RegistrationStatus{
    REGISTERED = 0,
    SIE = 1,
    ANULADO = 9
}

@Entity()
export class Enrollment {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'int', nullable: true })
    userId?: number;

    @ManyToOne(() => WebUser, { onDelete: 'CASCADE' })
    user: WebUser;

    @Column({ type: 'varchar', length: 255, nullable: true })
    documentType?: DocumentType;
    
    @Column({ type: 'varchar', length: 255, nullable: true })
    documentNumber?: string;
    
    @Column({ type: 'varchar', length: 255, nullable: true })
    name?: string;
    
    @Column({ type: 'varchar', length: 255, nullable: true })
    paternalName?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    maternalName?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    nationality?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    company?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    position?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    countryCode?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    address?: string;

    @Column({ type: 'int', nullable: true })
    departmentId?: number;

    @ManyToOne(() => Department, { onDelete: 'CASCADE' })
    department?: Department;

    @Column({ type: 'int', nullable: true })
    provinceId?: number;

    @ManyToOne(() => Province, { onDelete: 'CASCADE' })
    province?: Province;

    @Column({ type: 'int', nullable: true })
    districtId?: number;

    @ManyToOne(() => District, { onDelete: 'CASCADE' })
    district?: District;

    @Column({ type: 'varchar', length: 255, nullable: true })
    phoneNumber?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    email?: string;

    @Column({ type: 'int', nullable: true })
    feeId?: number;

    @ManyToOne(() => Fee, { onDelete: 'CASCADE' })
    fee: Fee;

    @Column({ type: 'decimal', default: 0 })
    amount: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    fileUrl?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    factType?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    factRuc?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    factRazonSocial?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    factAddress?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    factPerson?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    factPhone?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    paymentMethod: PaymentMethod;

    @Column({ type: 'varchar', length: 255, nullable: true })
    paymentFile?: string;

    @Column({ type: 'int', nullable: true })
    paymentStatus: PaymentStatus;

    @Column({ type: 'varchar', length: 255, nullable: true })
    visaResponse?: string;

    @Column({ type: 'int', nullable: true })
    registrationStatus: RegistrationStatus;

    @Column({ type: 'varchar', length: 255, nullable: true })
    registrationNumber: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
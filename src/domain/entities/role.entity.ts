import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Permission } from './permission.entity';

export enum RoleName {
    ADMIN = 'Admin',
    USER = 'User',
}

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ unique: true })
    name: string;

    @OneToMany(() => User, (user) => user.role)
    users: User[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @DeleteDateColumn()
    deletedAt?: Date;

    @ManyToMany(() => Permission, (permission) => permission.roles, {
        eager: true,
    })
    @JoinTable({
        name: 'role_permissions', // Nombre de la tabla intermedia
        joinColumn: { name: 'roleId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'permissionId', referencedColumnName: 'id' },
    })
    permissions: Permission[];
}
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Role } from './role.entity';

export enum PermissionModules {
    DASHBOARD = "dashboard",
    USERS = "users", //usuarios admin
    ROLES = "roles", //roles admin
    PARAMETERS = "parameters", //parametros
    MENU = "menu", //menu
    PAGES = "pages", //paginas
    BLOCKS = "blocks", //bloques
    WEB_USERS = "web_users", //usuarios web
    PAPERS = "papers", //papers
    INSCRIPTIONS = "inscriptions", //inscripciones
    EXHIBITORS = "exhibitors", //exhibidores
    SPEAKERS = "speakers", //conferencistas
    PROGRAMS = "programs", //programas
    GALLERY = "gallery", //multimedia
    PRESS_RELEASES = "press_releases", //prensa
    REPORTS = "reports", //reportes
}

export enum PermissionActions {
    CREATE = "create",
    READ = "read",
    UPDATE = "update",
    DELETE = "delete",
    INACTIVATE = "inactivate",
    ASSIGN_PERMISSION = "assign_permission",
    UNASSIGN_PERMISSION = "unassign_permission",
    CHANGE_STATUS = "change_status",
    VIEW_COMMENTS = "view_comments",
    MANAGE_COMMENTS = "manage_comments",
}

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'varchar', length: 100 })
    action: string;

    @Column({ type: 'varchar', length: 100 })
    module: string;

    @Column({ type: 'boolean', default: true })
    isActive?: boolean;

    @ManyToMany(() => Role, (role) => role.permissions)
    roles?: Role[];
}
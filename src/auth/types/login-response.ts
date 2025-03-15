import { User } from "../../domain/entities/user.entity";
import { WebUser } from "../../domain/entities/web-user.entity";

export interface LoginResponse {
    user: WebUser;
    token: string;
}

export interface DashbaordLoginResponse {
    user: User;
    token: string;
}
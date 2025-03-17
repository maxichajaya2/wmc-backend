import { ExecutionContext } from "@nestjs/common";
import { User } from "../../domain/entities/user.entity";
import { Role } from "../../domain/entities/role.entity";
import { WebUser } from "../../domain/entities/web-user.entity";
import { extractTokenFromHeader } from "./extract-from-header.helper";
import { LoginOrigin } from "../auth.service";

enum AccessErrors {
    NO_TOKEN,
    TOKEN_NOT_VALID,
    USER_NOT_FOUND,
}

export async function manageAccessToken({
    context,
    jwtService,
    findUserById,
    findWebUserById,
    findRoleById,
}: {
    context: ExecutionContext,
    jwtService: any,
    findWebUserById?: (id: number) => Promise<WebUser | null>,
    findUserById?: (id: number) => Promise<User | null>,
    findRoleById?: (id: number) => Promise<Role>,
}) {
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);
    const headers = request.headers;
    console.debug(`Headers: ${JSON.stringify(headers)}`);
    console.debug(`Token: ${token}`);
    if (!token) {
        console.debug('No token found');
        return {
            ok: false,
            code: AccessErrors.NO_TOKEN,
        }
    }
    try {
        console.debug('Verifying token');
        console.log({ token });
        const decoded = await jwtService.verifyAsync(token, {
            secret: process.env.JWT_SECRET,
        });
        console.log({ decoded });
        const { sub, origin, email } = decoded;
        console.debug(`Token verified for user ${sub}`);
        console.log({ sub, origin, email });

        if (origin === LoginOrigin.FRONTEND) {
            if (!findWebUserById) {
                throw new Error('findWebUserById is required for frontend');
            }
            const user = await findWebUserById(sub);
            if (!user) {
                console.debug('Web User not found');
                return {
                    ok: false,
                    code: AccessErrors.USER_NOT_FOUND,
                    origin
                }
            }
            return {
                ok: true,
                user,
                origin
            }
        }

        const user = await findUserById(sub);
        if (!user) {
            console.debug('User not found');
            return {
                ok: false,
                code: AccessErrors.USER_NOT_FOUND,
                origin
            }
        }

        if (!findRoleById) {
            throw new Error('findRoleById is required for backoffice');
        }
        const role = await findRoleById((user as User).role.id);
        user.role = role;
        return {
            ok: true,
            user: user as User,
            origin
        }
    } catch(e) {
        console.log(e);
        return {
            ok: false,
            code: AccessErrors.TOKEN_NOT_VALID,
        }
    }
} 
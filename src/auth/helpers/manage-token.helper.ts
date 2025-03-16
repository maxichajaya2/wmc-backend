import { ExecutionContext } from "@nestjs/common";
import { User } from "../../domain/entities/user.entity";
import { Role } from "../../domain/entities/role.entity";
import { WebUser } from "../../domain/entities/web-user.entity";

enum AccessErrors {
    NO_TOKEN,
    TOKEN_NOT_VALID,
    USER_NOT_FOUND,
}

export async function manageAccessToken({
    context,
    jwtService,
    findUserById,
    findRoleById,
    isBackOffice,
}: {
    context: ExecutionContext,
    jwtService: any,
    findUserById: (id: number) => Promise<User | WebUser | null>,
    findRoleById: (id: number) => Promise<Role>,
    isBackOffice: boolean,
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
    let user: User | WebUser;
    try {
        console.debug('Verifying token');
        const { sub } = await jwtService.verifyAsync(token, {
            secret: process.env.JWT_SECRET,
        });
        console.debug(`Token verified for user ${sub}`);
        const startDate = new Date().getTime();
        console.debug('Getting user');
        const user = await findUserById(sub);
        if (!user) {
            console.debug('User not found');
            return {
                ok: false,
                code: AccessErrors.USER_NOT_FOUND,
            }
        }
        console.debug('User found');
        const endDate = new Date().getTime();
        console.log('Time taken to get user in seconds : ', (endDate - startDate) / 1000);
        if (isBackOffice) {
            const role = await findRoleById((user as User).role.id);
            (user as User).role = role;
        }
        return {
            ok: true,
            user
        }
    } catch {
        return {
            ok: false,
            code: AccessErrors.TOKEN_NOT_VALID,
        }
    }
} 

function extractTokenFromHeader(request: Request): string | null {
    //@ts-ignore
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
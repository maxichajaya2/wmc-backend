import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../../domain/repositories/users.repository';
import { RolesRepository } from '../../domain/repositories/roles.repository';
import { manageAccessToken } from '../helpers/manage-token.helper';
import { WebUsersRepository } from '../../domain/repositories/web-users.repository';

@Injectable()
export class GlobalGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService,
        private readonly usersRepository: UsersRepository,
        private readonly webUsersRepository: WebUsersRepository,
        private readonly rolesRepository: RolesRepository,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        console.log('GlobalGuard - canActivate'); 
        const request = context.switchToHttp().getRequest();
        const response = await manageAccessToken({
            context,
            jwtService: this.jwtService,
            findUserById: this.usersRepository.findById.bind(this.usersRepository),
            findWebUserById: this.webUsersRepository.findById.bind(this.webUsersRepository),
            findRoleById: this.rolesRepository.findById.bind(this.rolesRepository),
        });
        const { ok, user, origin } = response;
        console.log({ ok, origin });
        if (!ok) {
            throw new UnauthorizedException();
        }
        request['loggedUser'] = user;
        request['loginOrigin'] = origin;
        return true;
    }
}

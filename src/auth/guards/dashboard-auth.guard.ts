import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../../domain/repositories/users.repository';
import { RolesRepository } from '../../domain/repositories/roles.repository';
import { manageAccessToken } from '../helpers/manage-token.helper';
import { LoginOrigin } from '../auth.service';

@Injectable()
export class DashboardAuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    private readonly rolesRepository: RolesRepository,
    ){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const response = await manageAccessToken({
      context,
      jwtService: this.jwtService,
      findUserById: this.usersRepository.findById.bind(this.usersRepository),
      findRoleById: this.rolesRepository.findById.bind(this.rolesRepository),
    });
    const { ok, user, origin } = response;
    if(!ok || origin !== LoginOrigin.BACKOFFICE){
      throw new UnauthorizedException();
    }
    const request = context.switchToHttp().getRequest();
    request['loggedUser'] = user;
    request['loginOrigin'] = LoginOrigin.BACKOFFICE;
    return true;
  }
}

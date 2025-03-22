import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WebUsersRepository } from '../../domain/repositories/web-users.repository';
import { manageAccessToken } from '../helpers/manage-token.helper';
import { LoginOrigin } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
    private readonly webUsersRepository: WebUsersRepository,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const response = await manageAccessToken({
      context,
      jwtService: this.jwtService,
      findWebUserById: this.webUsersRepository.findById.bind(this.webUsersRepository),
    });
    const { ok, user, origin } = response;
    if (!ok || origin !== LoginOrigin.FRONTEND) {
      throw new UnauthorizedException();
    }
    if(user.isActive === false){
      throw new UnauthorizedException("User is not active");
    }
    const request = context.switchToHttp().getRequest();
    request['loggedUser'] = user;
    console.log("seteando loginOrigin");
    console.log(LoginOrigin.FRONTEND);
    request['loginOrigin'] = LoginOrigin.FRONTEND;
    return true;
  }
}

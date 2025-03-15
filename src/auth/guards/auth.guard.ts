import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WebUsersRepository } from '../../domain/repositories/web-users.repository';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly webUsersRepository: WebUsersRepository,
    ){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const headers = request.headers;
    console.debug(`Headers: ${JSON.stringify(headers)}`);
    console.debug(`Token: ${token}`);
    if (!token) {
      console.debug('No token found');
      throw new UnauthorizedException();
    }
    try {
      console.debug('Verifying token');
      const { sub } = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      console.debug(`Token verified for user ${sub}`);
      const startDate = new Date().getTime();
      console.debug('Getting user');
      const user = await this.webUsersRepository.findById(sub);
      if(!user){
        console.debug('User not found');
        throw new UnauthorizedException();
      }
      console.debug('User found');
      const endDate = new Date().getTime();
      console.log('Time taken to get user in seconds : ', (endDate - startDate) / 1000);
      request['loggedUser'] = user;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | null {
    //@ts-ignore
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}

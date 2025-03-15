import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { AuthGuard } from './guards/auth.guard';
import { UserTokensService } from './services/user-tokens.service';
import { OtpService } from '../common/services/otp.service';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, ConfigService, OtpService, AuthGuard, UserTokensService],
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '180d' },
        }
      },
      inject: [ConfigService],
    }),
  ],
  exports: [
    JwtModule,
    JwtService,
    AuthGuard
  ]
})
export class AuthModule {}
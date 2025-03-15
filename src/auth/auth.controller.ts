import { Controller, Get, Post, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from './guards/auth.guard';
import { RegisterDto } from './dto/register.dto';
import { SendResetPasswordOtpDto } from './dto/send-reset-password-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateWebUserDto } from '../web-users/dto/create-web-user.dto';
import { DashboardAuthGuard } from './guards/dashboard-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('dashboard-login')
  dashboardSignIn(@Body() signInDto: SignInDto) {
    return this.authService.dashboardSignIn(signInDto);
  }

  @Post('pre-register')
  preRegister(@Body() registerDto: CreateWebUserDto) {
    return this.authService.preRegister(registerDto);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto.token);
  }

  @UseGuards(AuthGuard)
  @Get('authenticate')
  async getAuthenticatedUser(@Request() req: any) {
    return this.authService.getAuthenticatedUser(req);
  }

  @UseGuards(DashboardAuthGuard)
  @Get('dashboard-authenticate')
  async getDashboardAuthenticatedUser(@Request() req: any) {
    return this.authService.getAuthenticatedUser(req);
  }

  @HttpCode(HttpStatus.OK)
  @Post('send-reset-password-otp')
  sendResetPasswordOtp(@Body() sendResetPasswordOtpDto: SendResetPasswordOtpDto) {
    return this.authService.sendResetPasswordOtp(sendResetPasswordOtpDto.email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
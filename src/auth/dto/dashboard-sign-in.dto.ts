import { IsString } from 'class-validator';

export class DashboardSignInDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
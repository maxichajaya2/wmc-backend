import { IsNotEmpty, IsString } from 'class-validator';

export class SendOTPDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}
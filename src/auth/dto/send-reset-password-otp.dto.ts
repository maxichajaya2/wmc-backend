import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SendResetPasswordOtpDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}
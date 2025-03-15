import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsUUID()
  token: string;
}
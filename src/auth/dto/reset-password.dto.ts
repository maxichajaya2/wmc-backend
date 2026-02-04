import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional() @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  iimpPassword?: string;

  @IsOptional()
  @IsString()
  iimpDecryptedPassword?: string;

  @IsString()
  @IsUUID()
  token: string;
}
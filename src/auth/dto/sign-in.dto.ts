import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DocumentType } from '../../domain/entities/web-user.entity';

export class SignInDto {
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @IsString()
  @IsNotEmpty()
  documentNumber: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
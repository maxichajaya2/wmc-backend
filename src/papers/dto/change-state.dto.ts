import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { PaperState, PaperType } from '../../domain/entities/paper.entity';

export class ChangeStateDto {
  @IsEnum(PaperState)
  state: PaperState;

  @IsOptional()
  reviewerUserId?: number;

  @IsNumber()
  @IsOptional()
  leaderId?: number;

  @IsEnum(PaperType)
  @IsOptional()
  type?: PaperType;

  @IsNumber()
  @IsOptional()
  reviewerSupport1Id?: number;

  @IsNumber()
  @IsOptional()
  reviewerSupport2Id?: number;

  @IsNumber()
  @IsOptional()
  reviewerSupport3Id?: number;
}

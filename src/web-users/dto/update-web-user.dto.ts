import { PartialType } from '@nestjs/mapped-types';
import { CreateWebUserDto } from './create-web-user.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateWebUserDto extends PartialType(CreateWebUserDto) {
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
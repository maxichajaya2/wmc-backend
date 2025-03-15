import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Currency } from "../../domain/entities/fee.entity";

export class CreateFeeDto {
    @IsNumber()
    courseId: number;
    
    @IsString()
    @IsNotEmpty()
    nameEs: string;
    
    @IsString()
    @IsNotEmpty()
    nameEn: string;
    
    @IsBoolean()
    @IsOptional()
    memberFlag: boolean;
    
    @IsString()
    @IsOptional()
    startDate: Date;
    
    @IsString()
    @IsOptional()
    endDate: Date;
    
    @IsEnum(Currency)
    currency: Currency;
    
    @IsNumber()
    amount: number;
    
    @IsString()
    @IsOptional()
    noteEs: string;
    
    @IsString()
    @IsOptional()
    noteEn: string;
    
    @IsBoolean()
    @IsOptional()
    flagFile: boolean;
    
    @IsString()
    @IsOptional()
    sieCode: string;
    
    @IsBoolean()
    @IsOptional()
    isActive: boolean;
}
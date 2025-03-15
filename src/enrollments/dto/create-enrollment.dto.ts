import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { DocumentType } from "../../domain/entities/web-user.entity";
import { PaymentMethod } from "../../domain/entities/enrollment.entity";

export class CreateEnrollmentDto {
    @IsNumber()
    userId: number;
    
    @IsEnum(DocumentType)
    @IsOptional()
    documentType?: DocumentType;
    
    @IsString()
    @IsOptional()
    documentNumber?: string;
    
    @IsString()
    @IsOptional()
    name?: string;
    
    @IsString()
    @IsOptional()
    paternalName?: string;
    
    @IsString()
    @IsOptional()
    maternalName?: string;
    
    @IsString()
    @IsOptional()
    nationality?: string;
    
    @IsString()
    @IsOptional()
    company?: string;
    
    @IsString()
    @IsOptional()
    position?: string;
    
    @IsString()
    @IsOptional()
    countryCode?: string;
    
    @IsString()
    @IsOptional()
    address?: string;
    
    @IsNumber()
    @IsOptional()
    departmentId: number;
    
    @IsNumber()
    @IsOptional()
    provinceId: number;
    
    @IsNumber()
    @IsOptional()
    districtId: number;
    
    @IsString()
    @IsOptional()
    phoneNumber?: string;
    
    @IsString()
    @IsOptional()
    email?: string;
    
    @IsNumber()
    feeId: number;
    
    @IsNumber()
    amount: number;
    
    @IsString()
    @IsOptional()
    fileUrl?: string;
    
    @IsString()
    @IsOptional()
    factType?: string;
    
    @IsString()
    @IsOptional()
    factRuc?: string;
    
    @IsString()
    @IsOptional()
    factRazonSocial?: string;
    
    @IsString()
    @IsOptional()
    factAddress?: string;
    
    @IsString()
    @IsOptional()
    factPerson?: string;
    
    @IsString()
    @IsOptional()
    factPhone?: string;
    
    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;
    
    @IsString()
    @IsOptional()
    paymentFile?: string;
}
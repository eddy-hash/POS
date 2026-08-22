import { IsString, IsNumber, IsOptional, IsArray, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePurchaseItemDto {
  @IsOptional()
  @IsNumber()
  productId?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  // ✅ Allow any extra fields
  [key: string]: any;
}

export class CreatePurchaseDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  supplier?: string;

  @IsOptional()
  @IsNumber()
  supplierId?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @Type(() => CreatePurchaseItemDto)
  items?: CreatePurchaseItemDto[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalAmount?: number;

  @IsOptional()
  @IsString()
  orderDate?: string;

  @IsOptional()
  @IsString()
  status?: string;

  // ✅ Allow any extra fields
  [key: string]: any;
}

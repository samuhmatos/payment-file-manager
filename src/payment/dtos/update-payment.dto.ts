import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdatePaymentDto {
  @IsOptional()
  @IsString()
  @MaxLength(15)
  name?: string;

  @IsOptional()
  @IsInt()
  age?: number;

  @IsOptional()
  @IsString()
  @MaxLength(34)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(11)
  cpf?: string;

  @IsOptional()
  total?: number;

  @IsOptional()
  @IsDateString()
  @MaxLength(10)
  birth_date?: Date;
}

import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;
}

import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from 'src/common/decorators/roles.decorator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(8)
  passwordHash?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

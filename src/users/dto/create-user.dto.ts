import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from 'src/common/decorators/roles.decorator';
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  passwordHash: string;

  @IsEnum(Role)
  role: Role;
}

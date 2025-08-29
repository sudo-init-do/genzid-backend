import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 60)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(2, 160)
  bio?: string;

  @IsOptional()
  @IsString()
  @Length(3, 24)
  username?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}

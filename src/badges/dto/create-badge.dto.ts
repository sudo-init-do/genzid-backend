import { IsString, Length } from 'class-validator';

export class CreateBadgeDto {
  @IsString()
  @Length(2, 40)
  name!: string;

  @IsString()
  @Length(2, 40)
  slug!: string;

  @IsString()
  @Length(0, 160)
  description?: string;
}

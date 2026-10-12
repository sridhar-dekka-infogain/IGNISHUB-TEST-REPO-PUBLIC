import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBlockDto {
  @IsDateString({ strict: true }, { message: 'startDate must be a YYYY-MM-DD date string' })
  startDate!: string;

  @IsDateString({ strict: true }, { message: 'endDate must be a YYYY-MM-DD date string' })
  endDate!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

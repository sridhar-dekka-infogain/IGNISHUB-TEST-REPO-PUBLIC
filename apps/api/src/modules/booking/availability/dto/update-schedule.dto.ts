import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsInt, Matches, Max, Min, ValidateNested } from 'class-validator';

/** Matches 24-hour 'HH:MM' time strings, e.g. '09:00', '23:45'. */
export const TIME_FORMAT_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export class TimeSlotDto {
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek!: number;

  @Matches(TIME_FORMAT_REGEX, { message: 'startTime must be in HH:MM 24-hour format' })
  startTime!: string;

  @Matches(TIME_FORMAT_REGEX, { message: 'endTime must be in HH:MM 24-hour format' })
  endTime!: string;
}

export class UpdateScheduleDto {
  @IsArray()
  @ArrayMaxSize(7 * 24, { message: 'schedule has too many slots' })
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  schedule!: TimeSlotDto[];
}

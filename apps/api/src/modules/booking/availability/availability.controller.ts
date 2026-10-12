import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { CreateBlockDto } from './dto/create-block.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { CaregiverApprovedGuard } from '../../../common/guards/caregiver-approved.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { AuditLog } from '../../../common/decorators/audit-log.decorator';
import { AuditLogInterceptor } from '../../../common/interceptors/audit-log.interceptor';
import { ResponseEnvelopeInterceptor } from '../../../common/interceptors/response-envelope.interceptor';
import { AuthenticatedRequest } from '../../../common/types/authenticated-request';

@Controller('api/v1/caregivers/me/availability')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Caregiver')
@UseInterceptors(ResponseEnvelopeInterceptor, AuditLogInterceptor)
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  // --- AC1: Weekly Availability Schedule API -----------------------------
  @Put('schedule')
  @UseGuards(CaregiverApprovedGuard)
  @AuditLog('CAREGIVER_AVAILABILITY_UPDATED')
  async updateSchedule(@Req() request: AuthenticatedRequest, @Body() dto: UpdateScheduleDto) {
    const slots = await this.availabilityService.updateSchedule(request.user.id, dto);
    return {
      schedule: slots.map((slot) => ({
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
      })),
      updatedAt: new Date().toISOString(),
    };
  }

  // --- AC2: Get Own Availability Schedule ---------------------------------
  @Get('schedule')
  async getSchedule(@Req() request: AuthenticatedRequest) {
    const slots = await this.availabilityService.getSchedule(request.user.id);
    return {
      schedule: slots.map((slot) => ({
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
      })),
    };
  }

  // --- AC3: Block Specific Dates -------------------------------------------
  @Post('blocks')
  @UseGuards(CaregiverApprovedGuard)
  async createBlock(@Req() request: AuthenticatedRequest, @Body() dto: CreateBlockDto) {
    const block = await this.availabilityService.createBlock(request.user.id, dto);
    return {
      blockId: block.id,
      startDate: dto.startDate,
      endDate: dto.endDate,
      createdAt: block.createdAt.toISOString(),
    };
  }

  // --- AC4: List and Delete Availability Blocks ---------------------------
  @Get('blocks')
  async listBlocks(@Req() request: AuthenticatedRequest) {
    const blocks = await this.availabilityService.listFutureBlocks(request.user.id);
    return {
      blocks: blocks.map((block) => ({
        blockId: block.id,
        startDate: this.toDateOnlyString(block.startDate),
        endDate: this.toDateOnlyString(block.endDate),
        reason: block.reason ?? undefined,
        createdAt: block.createdAt.toISOString(),
      })),
    };
  }

  @Delete('blocks/:blockId')
  @UseGuards(CaregiverApprovedGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlock(@Req() request: AuthenticatedRequest, @Param('blockId') blockId: string): Promise<void> {
    await this.availabilityService.deleteBlock(request.user.id, blockId);
  }

  private toDateOnlyString(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}

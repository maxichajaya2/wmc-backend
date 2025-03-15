import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { ChangePaymentStatusDto } from './dto/change-payment-status.dto';
import { ChangeRegistrationStatusDto } from './dto/change-registration-status.dto';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  @Get()
  findAll() {
    return this.enrollmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnrollmentDto: UpdateEnrollmentDto) {
    return this.enrollmentsService.update(+id, updateEnrollmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollmentsService.remove(+id);
  }

  @HttpCode(200)
  @Post(':id/registration-status')
  changeRegistrationStatus(@Param('id') id: string, @Body() changeRegistrationStatusDto: ChangeRegistrationStatusDto) {
    return this.enrollmentsService.changeRegistrationStatus(+id, changeRegistrationStatusDto);
  }
  
  @HttpCode(200)
  @Post(':id/payment-status')
  changePaymentStatus(@Param('id') id: string, @Body() changePaymentStatusDto: ChangePaymentStatusDto) {
    return this.enrollmentsService.changePaymentStatus(+id, changePaymentStatusDto);
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { EnrollmentsRepository } from '../domain/repositories/enrollments.repository';
import { DepartmentsRepository } from '../domain/repositories/departments.repository';
import { DistrictsRepository } from '../domain/repositories/districts.repository';
import { ProvincesRepository } from '../domain/repositories/provinces.repository';
import { FeesRepository } from '../domain/repositories/fees.repository';
import { Enrollment, PaymentMethod, PaymentStatus, RegistrationStatus } from '../domain/entities/enrollment.entity';
import { WebUsersRepository } from '../domain/repositories/web-users.repository';
import { CountriesService } from '../common/services/countries.service';
import { ChangeRegistrationStatusDto } from './dto/change-registration-status.dto';
import { ChangePaymentStatusDto } from './dto/change-payment-status.dto';

@Injectable()
export class EnrollmentsService {

  constructor(
    private readonly enrollmentsRepository: EnrollmentsRepository,
    private readonly departmentRepository: DepartmentsRepository,
    private readonly districtRepository: DistrictsRepository,
    private readonly provinceRepository: ProvincesRepository,
    private readonly feeRepository: FeesRepository,
    private readonly webUsersRepository: WebUsersRepository,
    private readonly countriesService: CountriesService,
  ) { }

  async create(createEnrollmentDto: CreateEnrollmentDto) {
    const { departmentId, districtId, provinceId, feeId, userId, countryCode, paymentMethod, paymentFile } = createEnrollmentDto;
    if (countryCode) {
      const country = this.countriesService.getCountry(countryCode);
      if (!country) {
        throw new NotFoundException('Country not found');
      }
    }
    if (paymentMethod === PaymentMethod.DEPOSIT && !paymentFile) {
      throw new NotFoundException('Payment file is required');
    }
    console.log({ departmentId, districtId, provinceId, feeId, userId });
    if (countryCode === 'PE' && (!departmentId || !provinceId || !districtId)) {
      throw new BadRequestException({
        code: 'MISSING_REQUIRED_FIELDS'
      });
    }
    const [fee, webUser] = await Promise.all([
      this.feeRepository.repository.findOne({
        where: { id: feeId },
      }),
      this.webUsersRepository.repository.findOne({
        where: { id: userId },
      }),
    ]);
    let department = null;
    let province = null;
    let district = null;
    if (departmentId) {
      department = await this.departmentRepository.repository.findOneOrFail({
        where: { id: departmentId },
      });
    }
    if (provinceId) {
      province = await this.provinceRepository.repository.findOneOrFail({
        where: { id: provinceId },
      });
    }
    if (districtId) {
      district = await this.districtRepository.repository.findOneOrFail({
        where: { id: districtId },
      });
    }
    if (!fee) {
      throw new NotFoundException('Fee not found');
    }
    if (!webUser) {
      throw new NotFoundException('User not found');
    }
    const enrollment: Enrollment = {
      ...createEnrollmentDto,
      createdAt: new Date(),
      fee,
      paymentStatus: PaymentStatus.PENDING,
      registrationStatus: RegistrationStatus.REGISTERED,
      user: webUser,
      registrationNumber: null,
    }
    if (department) {
      enrollment.department = department;
    }
    if (province) {
      enrollment.province = province;
    }
    if (district) {
      enrollment.district = district;
    }
    return this.enrollmentsRepository.repository.save(enrollment);
  }

  async findAll() {
    // let where = {};
    // if(onlyActive){
    //   where = { isActive: true };
    // }
    return this.enrollmentsRepository.repository.find({
      relations: ['department', 'district', 'province', 'fee', 'user'],
    });
  }

  // async findOne(id: number, {onlyActive} = {onlyActive: false}) {
  async findOne(id: number) {
    let where = { id };
    // if(onlyActive){
    //   where['isActive'] = true;
    // }
    const enrollment = await this.enrollmentsRepository.repository.findOne({
      where,
      relations: ['department', 'district', 'province', 'fee', 'user', 'fee.course', 'fee.course.conferenceType'],
    });
    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }
    return enrollment;
  }

  async update(id: number, updateEnrollmentDto: UpdateEnrollmentDto) {
    const enrollment = await this.findOne(id);
    const { departmentId, provinceId, districtId, userId, feeId, countryCode, paymentMethod, paymentFile } = updateEnrollmentDto;
    if (paymentMethod === PaymentMethod.DEPOSIT && !paymentFile) {
      throw new NotFoundException('Payment file is required');
    }
    if (countryCode && enrollment.countryCode !== countryCode) {
      const country = this.countriesService.getCountry(countryCode);
      if (!country) {
        throw new NotFoundException('Country not found');
      }
    }
    if (departmentId && enrollment.departmentId !== departmentId) {
      const department = await this.departmentRepository.repository.findOne({
        where: { id: departmentId },
      });
      if (!department) {
        throw new NotFoundException('Department not found');
      }
      enrollment.department = department;
    }
    if (provinceId && enrollment.provinceId !== provinceId) {
      const province = await this.provinceRepository.repository.findOne({
        where: { id: provinceId },
      });
      if (!province) {
        throw new NotFoundException('Province not found');
      }
      enrollment.province = province;
    }
    if (districtId && enrollment.districtId !== districtId) {
      const district = await this.districtRepository.repository.findOne({
        where: { id: districtId },
      });
      if (!district) {
        throw new NotFoundException('District not found');
      }
      enrollment.district = district;
    }
    if (userId && enrollment.userId !== userId) {
      const user = await this.webUsersRepository.repository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      enrollment.user = user;
    }
    if (feeId && enrollment.feeId !== feeId) {
      const fee = await this.feeRepository.repository.findOne({
        where: { id: feeId },
      });
      if (!fee) {
        throw new NotFoundException('Fee not found');
      }
      enrollment.fee = fee;
    }
    const updatedEnrollment = {
      ...enrollment,
      ...updateEnrollmentDto,
      updatedAt: new Date(),
    }
    await this.enrollmentsRepository.repository.update(id, updatedEnrollment);
    return updatedEnrollment;
  }

  async remove(id: number) {
    this.enrollmentsRepository.repository.softDelete(id);
    return null;
  }

  async changeRegistrationStatus(id: number, changeStatusDto: ChangeRegistrationStatusDto) {
    const { status } = changeStatusDto;
    const enrollment = await this.findOne(id);
    console.log(enrollment);
    enrollment.registrationStatus = status;
    await this.enrollmentsRepository.repository.update(id, enrollment);
    return enrollment;
  }

  async changePaymentStatus(id: number, changeStatusDto: ChangePaymentStatusDto) {
    const { status } = changeStatusDto;
    const enrollment = await this.findOne(id);
    if (enrollment.paymentMethod !== PaymentMethod.DEPOSIT) {
      throw new BadRequestException({
        code: 'NOT_ALLOWED'
      });
    }
    enrollment.paymentStatus = status;
    await this.enrollmentsRepository.repository.update(id, enrollment);
    return enrollment;
  }
}

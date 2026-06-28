import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { CreateAttendanceDto } from '@core/dto';
import { EnrollmentDetailEntity, PartialEntity } from '@core/entities';
import { AttendancesService, EnrollmentDetailsService, PartialsService } from '@core/services';

@Injectable()
export class AttendancesSeeder {
  private enrollmentDetails: EnrollmentDetailEntity[] = [];

  constructor(
    private enrollmentDetailService: EnrollmentDetailsService,
    private attendancesService: AttendancesService,
    private partialService: PartialsService,
  ) {}

  private partials: PartialEntity[] = [];

  async run() {
    await this.loadEnrollmentsDetail();
    await this.loadPartial();
    await this.create();
  }

  private async loadEnrollmentsDetail() {
    this.enrollmentDetails = (await this.enrollmentDetailService.findAll()).data as EnrollmentDetailEntity[];
  }

  private async loadPartial() {
    this.partials = (await this.partialService.findAll()).data as PartialEntity[];
  }

  private async create() {
    const attendances: CreateAttendanceDto[] = [];

    this.enrollmentDetails.forEach(enrollmentDetail => {
      attendances.push({
        value: faker.helpers.rangeToNumber({ min: 0, max: 100 }),
        enrollmentDetail: enrollmentDetail,
        partial: this.partials[faker.helpers.rangeToNumber({ min: 0, max: this.partials.length - 1 })],
      });
    });


    for (const item of attendances) {
      await this.attendancesService.create(item);
    }
  }
}

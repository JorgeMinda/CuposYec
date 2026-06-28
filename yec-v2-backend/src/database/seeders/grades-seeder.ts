import { Injectable } from '@nestjs/common';
import { CreateGradeDto } from '@core/dto';
import { EnrollmentDetailsService, PartialsService } from 'src/modules/core/services';
import { GradesService } from 'src/modules/core/services/grades.service';
import { EnrollmentDetailEntity, PartialEntity } from '@core/entities';
import { faker } from '@faker-js/faker';

@Injectable()
export class GradeSeeder {
  private enrollmentDetails: EnrollmentDetailEntity[] = [];

  constructor(private enrollmentDetailService: EnrollmentDetailsService, private gradeService: GradesService, private partialService: PartialsService) {}
  private partials: PartialEntity[] = [];

  async run() {
    await this.loadEnrollmentsDetail();
    await this.loadPartial();
    await this.createGrades();
  }

  private async loadEnrollmentsDetail() {
    this.enrollmentDetails = (await this.enrollmentDetailService.findAll()).data as EnrollmentDetailEntity[];
  }

  private async loadPartial() {
    this.partials = (await this.partialService.findAll()).data as PartialEntity[];
  }

  private async createGrades() {
    const grades: CreateGradeDto[] = [];

    this.enrollmentDetails.forEach(enrollmentDetail => {
      grades.push({
        value: faker.helpers.rangeToNumber({ min: 0, max: 100 }),
        enrollmentDetail: enrollmentDetail,
        partial: this.partials[faker.helpers.rangeToNumber({ min: 0, max: this.partials.length - 1 })],
      });
    });

    for (const grade of grades) {
      await this.gradeService.create(grade);
    }
  }
}

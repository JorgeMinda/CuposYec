import { Injectable } from '@nestjs/common';
import { CareersService, InformationStudentsService } from '@core/services';
import { UserEntity } from '@auth/entities';
import { SeedStudentDto } from '@core/dto';
import { CareerEntity, StudentEntity } from '@core/entities';
import { SeederInformationStudentDto } from '@core/dto';
import { RoleEnum } from '@auth/enums';
import { faker } from '@faker-js/faker';
import { StudentsService } from '../../modules/core/services/students.service';
import { UsersService } from '../../modules/auth/services/users.service';

@Injectable()
export class StudentsSeeder {
  private careers: CareerEntity[] = [];

  constructor(
    private studentsService: StudentsService,
    private informationStudentsService: InformationStudentsService,
    private usersService: UsersService,
    private careersService: CareersService,
  ) {}

  async run() {
    await this.loadCareers();
    await this.createStudents();
    await this.createInformationStudents();
  }

  async loadCareers() {
    this.careers = (await this.careersService.findAll()).data;
  }

  async createStudents() {
    const students: SeedStudentDto[] = [];

    let users = (await this.usersService.findAll()).data;

    users = users.filter((user: UserEntity) => user.roles.some(role => role.code === RoleEnum.STUDENT));

    users.forEach((user: UserEntity) => {
        students.push({
            user,
            careers: user.careers,
        });
    });

    for (const item of students) {
      await this.studentsService.create(item);
    }
  }

  async createInformationStudents() {
    const informationStudents: SeederInformationStudentDto[] = [];
    const students = (await this.studentsService.findAll()).data;

    students.forEach((student: StudentEntity) => {
      informationStudents.push({
        student: student,
      });
    });

    for (const item of informationStudents) {
      await this.informationStudentsService.create(item);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { CareersService, InformationTeachersService } from '@core/services';
import { UserEntity } from '@auth/entities';
import { SeedTeacherDto } from '@core/dto';
import { CareerEntity, TeacherEntity } from '@core/entities';
import { SeederInformationTeacherDto } from '@core/dto';
import { RoleEnum } from '@auth/enums';
import { faker } from '@faker-js/faker';
import { TeachersService } from '../../modules/core/services/teachers.service';
import { UsersService } from '../../modules/auth/services/users.service';

@Injectable()
export class TeachersSeeder {
  private careers: CareerEntity[] = [];

  constructor(
    private teachersService: TeachersService,
    private informationTeachersService: InformationTeachersService,
    private usersService: UsersService,
    private careersService: CareersService,
  ) {}

  async run() {
    await this.loadCareers();
    await this.createTeachers();
    await this.createInformationTeachers();
  }

  async loadCareers() {
    this.careers = (await this.careersService.findAll()).data;
  }

  async createTeachers() {
    const teachers: SeedTeacherDto[] = [];
    let users = (await this.usersService.findAll()).data;

    users = users.filter((user: UserEntity) => user.roles.some(role => role.code === RoleEnum.TEACHER));

    users.forEach((user: UserEntity) => {
      teachers.push({
        user: user,
        careers: [this.careers[faker.helpers.rangeToNumber({ min: 0, max: this.careers.length - 1 })]],
      });
    });

    for (const item of teachers) {
      await this.teachersService.create(item);
    }
  }

  async createInformationTeachers() {
    const informationTeachers: SeederInformationTeacherDto[] = [];
    const teachers = (await this.teachersService.findAll());

    teachers.forEach((teacher: TeacherEntity) => {
      informationTeachers.push({
        teacher: teacher,
      });
    });

    for (const item of informationTeachers) {
      await this.informationTeachersService.create(item);
    }
  }
}

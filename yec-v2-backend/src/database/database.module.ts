import { Global, Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import {
  AttendancesSeeder,
  CareersSeeder,
  CataloguesSeeder,
  ClassroomSeeder,
  CurriculumsSeeder,
  DatabaseSeeder,
  EnrollmentSeeder,
  GradeSeeder,
  InstitutionsSeeder,
  LocationsSeeder,
  MenusSeeder,
  PartialsSeeder,
  RolesSeeder,
  SchoolPeriodSeeder,
  StudentsSeeder,
  SubjectsSeeder,
  TeacherDistributionsSeeder,
  TeachersSeeder,
  UsersSeeder,
} from '@database/seeders';
import { UsersService } from '../modules/auth/services/users.service';
import { MenusService, RolesService } from '@auth/services';
import { authProviders } from '@auth/providers';

@Global()
@Module({
  providers: [
    ...databaseProviders,
    DatabaseSeeder,
    AttendancesSeeder,
    CataloguesSeeder,
    UsersSeeder,
    RolesSeeder,
    MenusSeeder,
    LocationsSeeder,
    CareersSeeder,
    InstitutionsSeeder,
    StudentsSeeder,
    TeachersSeeder,
    SubjectsSeeder,
    CurriculumsSeeder,
    PartialsSeeder,
    EnrollmentSeeder,
    GradeSeeder,
    ClassroomSeeder,
    SchoolPeriodSeeder,
    TeacherDistributionsSeeder,
  ],
  exports: [...databaseProviders, DatabaseSeeder],
})
export class DatabaseModule {}

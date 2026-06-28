import {Injectable} from '@nestjs/common';
import * as fs from 'fs';
import {join} from 'path';
import {
    AttendancesSeeder,
    CareersSeeder,
    CataloguesSeeder,
    ClassroomSeeder,
    CurriculumsSeeder,
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

@Injectable()
export class DatabaseSeeder {
    constructor(
        private cataloguesSeeder: CataloguesSeeder,
        private usersSeeder: UsersSeeder,
        private rolesSeeder: RolesSeeder,
        private menusSeeder: MenusSeeder,
        private institutionsSeeder: InstitutionsSeeder,
        private careersSeeder: CareersSeeder,
        private schoolsPeriodsSeeder: SchoolPeriodSeeder,
        private studentsSeeder: StudentsSeeder,
        private teacherSeeder: TeachersSeeder,
        private curriculumsSeeder: CurriculumsSeeder,
        private subjectsSeeder: SubjectsSeeder,
        private partialsSeeder: PartialsSeeder,
        private enrollmentsSeeder: EnrollmentSeeder,
        private gradesSeeder: GradeSeeder,
        private classroomsSeeder: ClassroomSeeder,
        private locationsSeeder: LocationsSeeder,
        private teacherDistributionsSeeder: TeacherDistributionsSeeder,
        private attendancesSeeder: AttendancesSeeder,
    ) {
    }

    async run() {
        /** Auth Seeders **/
        await this.cataloguesSeeder.run();
        await this.rolesSeeder.run();
        await this.institutionsSeeder.run();
        await this.careersSeeder.run();
        await this.usersSeeder.run();
        await this.menusSeeder.run();
        this.createUploadsDirectories();

        /** Core Seeders **/
        await this.schoolsPeriodsSeeder.run();
        await this.studentsSeeder.run();
        await this.teacherSeeder.run();
        await this.curriculumsSeeder.run();
        await this.subjectsSeeder.run();
        await this.partialsSeeder.run();
        // await this.enrollmentsSeeder.run();
        // await this.gradesSeeder.run();
        await this.classroomsSeeder.run();
        await this.locationsSeeder.run();
        await this.teacherDistributionsSeeder.run();
        // await this.attendancesSeeder.run();
    }

    createUploadsDirectories() {
        const date = new Date();
        for (let i = date.getFullYear(); i < date.getFullYear() + 20; i++) {
            const path = join(process.cwd(), 'storage/private/uploads', i.toString());
            fs.mkdir(path, err => {
                if (err) {
                    // console.log(err);
                }
            });

            for (let j = 1; j <= 12; j++) {
                const path = join(process.cwd(), 'storage/private/uploads', i.toString());
                fs.mkdir(path, err => {
                    if (err) {
                        // console.log(err);
                    }
                });
            }
        }
    }
}

import {Injectable} from '@nestjs/common';
import {faker} from '@faker-js/faker';
import {CatalogueTypeEnum} from '@shared/enums';
import {SeedUserDto} from '@auth/dto';
import {RoleEntity} from '@auth/entities';
import {RoleEnum} from '@auth/enums';
import {RolesService} from '@auth/services';
import {CareerEntity, CatalogueEntity, InstitutionEntity} from '@core/entities';
import {CareersService, CataloguesService, InstitutionsService} from '@core/services';
import * as XLSX from "xlsx";
import {join} from "path";
import { UsersService } from '../../modules/auth/services/users.service';

@Injectable()
export class UsersSeeder {
    private identificationTypes: CatalogueEntity[] = [];
    private roles: RoleEntity[] = [];
    private institutions: InstitutionEntity[] = [];
    private careers: CareerEntity[] = [];

    constructor(
        private careersService: CareersService,
        private rolesService: RolesService,
        private usersService: UsersService,
        private cataloguesService: CataloguesService,
        private institutionsService: InstitutionsService,
    ) {
    }

    async run() {
        await this.loadRoles();
        await this.loadInstitutions();
        await this.loadCareers();
        await this.loadCatalogues();
        await this.createUsers();
        await this.createStudentUsers();
        await this.createTeacherUsers();
    }

    async loadCareers() {
        this.careers = (await this.careersService.findCareersByInstitution(this.institutions[0].id)).data;
    }

    async loadRoles() {
        this.roles = (await this.rolesService.findAll()).data as RoleEntity[];
    }

    async loadInstitutions() {
        this.institutions = (await this.institutionsService.findAll()).data;
    }

    async loadCatalogues() {
        const catalogues = (await this.cataloguesService.findAll()).data as CatalogueEntity[];

        this.identificationTypes = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.IDENTIFICATION_TYPE);

    }

    async createUsers() {
        const users: SeedUserDto[] = [];

        const adminRole = this.roles.find(role => role.code === RoleEnum.ADMIN);
        const coordinatorAdministrativeRole = this.roles.find(role => role.code === RoleEnum.COORDINATOR_ADMINISTRATIVE);
        const coordinatorCareerRole = this.roles.find(role => role.code === RoleEnum.COORDINATOR_CAREER);
        const rectorRole = this.roles.find(role => role.code === RoleEnum.RECTOR);
        const reviewerRole = this.roles.find(role => role.code === RoleEnum.REVIEWER);
        const secretaryRole = this.roles.find(role => role.code === RoleEnum.SECRETARY);
        const welfareRole = this.roles.find(role => role.code === RoleEnum.WELFARE);

        const institution = this.institutions[0];

        users.push(
            {
                identificationType:
                    this.identificationTypes[
                        faker.helpers.rangeToNumber({
                            min: 0,
                            max: this.identificationTypes.length - 1,
                        })
                        ],
                birthdate: faker.date.birthdate(),
                cellPhone: '',
                identification: 'user1',
                institutions: [],
                email: 'admin@correo.com',
                lastname: 'Perez',
                name: 'Admin',
                password: 'Siaaw23*',
                passwordChanged: false,
                personalEmail: faker.internet.email(),
                roles: [adminRole],
                username: 'admin',
                careers: [],
            },
            {
                identificationType:
                    this.identificationTypes[
                        faker.helpers.rangeToNumber({
                            min: 0,
                            max: this.identificationTypes.length - 1,
                        })
                        ],
                birthdate: faker.date.birthdate(),
                cellPhone: '',
                identification: 'user2',
                institutions: [],
                email: 'coordinator_administrative@correo.com',
                lastname: 'Administrative',
                name: 'Coordinator',
                password: 'Siaaw23*',
                passwordChanged: false,
                roles: [coordinatorAdministrativeRole],
                personalEmail: faker.internet.email(),
                username: 'coordinator_administrative',
                careers: [],
            },
            {
                identificationType:
                    this.identificationTypes[
                        faker.helpers.rangeToNumber({
                            min: 0,
                            max: this.identificationTypes.length - 1,
                        })
                        ],
                birthdate: faker.date.birthdate(),
                cellPhone: '',
                identification: 'user3',
                institutions: [institution],
                email: 'coordinator_career@correo.com',
                lastname: 'Career',
                name: 'Coordinator',
                password: 'Siaaw23*',
                passwordChanged: false,
                roles: [coordinatorCareerRole],
                personalEmail: faker.internet.email(),
                username: 'coordinator_career',
                careers: this.careers,
            },
            {
                identificationType:
                    this.identificationTypes[
                        faker.helpers.rangeToNumber({
                            min: 0,
                            max: this.identificationTypes.length - 1,
                        })
                        ],
                birthdate: faker.date.birthdate(),
                cellPhone: '',
                identification: 'user4',
                institutions: [institution],
                email: 'rector@correo.com',
                lastname: 'Perez',
                name: 'Rector',
                password: 'Siaaw23*',
                passwordChanged: false,
                personalEmail: faker.internet.email(),
                roles: [rectorRole],
                username: 'rector',
                careers: [],
            },
            {
                identificationType:
                    this.identificationTypes[
                        faker.helpers.rangeToNumber({
                            min: 0,
                            max: this.identificationTypes.length - 1,
                        })
                        ],
                birthdate: faker.date.birthdate(),
                cellPhone: '',
                identification: 'user5',
                institutions: [institution],
                email: 'reviewer@correo.com',
                lastname: 'Perez',
                name: 'Reviewer',
                password: 'Siaaw23*',
                passwordChanged: false,
                personalEmail: faker.internet.email(),
                roles: [reviewerRole],
                username: 'reviewer',
                careers: [this.careers[0]],
            },
            {
                identificationType:
                    this.identificationTypes[
                        faker.helpers.rangeToNumber({
                            min: 0,
                            max: this.identificationTypes.length - 1,
                        })
                        ],
                birthdate: faker.date.birthdate(),
                cellPhone: '',
                identification: 'user6',
                institutions: [institution],
                email: 'secretary@correo.com',
                lastname: 'Perez',
                name: 'Secretary',
                password: 'Siaaw23*',
                passwordChanged: false,
                personalEmail: faker.internet.email(),
                roles: [secretaryRole],
                username: 'secretary',
                careers: this.careers,
            },
            {
                identificationType:
                    this.identificationTypes[
                        faker.helpers.rangeToNumber({
                            min: 0,
                            max: this.identificationTypes.length - 1,
                        })
                        ],
                birthdate: faker.date.birthdate(),
                cellPhone: '',
                identification: 'user7',
                institutions: [institution],
                email: 'welfare@correo.com',
                lastname: 'Estudiantil',
                name: 'Bienestar',
                password: 'Siaaw23*',
                passwordChanged: false,
                personalEmail: faker.internet.email(),
                roles: [welfareRole],
                username: 'welfare',
                careers: this.careers,
            }
        );

        for (const user of users) {
            // await this.usersService.create(user);
        }
    }

    async createStudentUsers() {
        const workbook = XLSX.readFile(join(process.cwd(), 'src/database/seeders/files/students.xlsx'));

        const workbookSheets = workbook.SheetNames;
        const sheet = workbookSheets[0];
        const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

        const users: SeedUserDto[] = [];
        const studentRole = this.roles.find(role => role.code === RoleEnum.STUDENT);
        const institution = this.institutions[0];

        for (const item of dataExcel) {
            users.push({
                identificationType: this.identificationTypes[0],
                birthdate: item['birthdate'],
                cellPhone: item['cell_phone'],
                identification: item['identification'],
                institutions: [institution],
                email: item['personal_email'],
                lastname: item['lastname'],
                name: item['name'],
                password: item['identification'],
                passwordChanged: false,
                personalEmail: item['personal_email'],
                roles: [studentRole],
                username: item['identification'],
                careers: [this.careers.find(career => career.code === item['career_code'])],
            });
        }


        for (const user of users) {
            // await this.usersService.create(user);
        }
    }

    async createTeacherUsers() {
        const users: SeedUserDto[] = [];

        const teacherRole = this.roles.find(role => role.code === RoleEnum.TEACHER);
        const institution = this.institutions[0];

        for (let i = 0; i < 10; i++) {
            const identification = 'teacher' + i;
            users.push({
                identificationType:
                    this.identificationTypes[
                        faker.helpers.rangeToNumber({
                            min: 0,
                            max: this.identificationTypes.length - 1,
                        })
                        ],
                birthdate: faker.date.birthdate(),
                cellPhone: '0987654321',
                identification: identification,
                institutions: [institution],
                email: faker.internet.email(),
                lastname: faker.person.lastName(),
                name: faker.person.firstName(),
                password: 'Siaaw23*',
                passwordChanged: false,
                personalEmail: faker.internet.email(),
                roles: [teacherRole],
                username: identification,
                careers: [this.careers[faker.helpers.rangeToNumber({min: 0, max: this.careers.length - 1,})]],
            });
        }

        for (const user of users) {
            // await this.usersService.create(user);
        }
    }
}

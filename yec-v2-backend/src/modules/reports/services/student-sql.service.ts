import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  CareerEntity,
  CatalogueEntity, EnrollmentDetailEntity, EnrollmentDetailStateEntity,
  EnrollmentEntity,
  EnrollmentStateEntity, InformationStudentEntity, LocationEntity,
  OriginAddressEntity, ResidenceAddressEntity,
  StudentEntity,
} from '@core/entities';
import { CatalogueEnrollmentStateEnum, CatalogueTypeEnum, CoreRepositoryEnum } from '@shared/enums';
import { UserEntity } from '@auth/entities';
import { CataloguesService } from '@core/services';

@Injectable()
export class StudentSqlService {
  constructor(
    @Inject(CoreRepositoryEnum.STUDENT_REPOSITORY) private readonly repository: Repository<StudentEntity>,
    private readonly cataloguesService: CataloguesService,
  ) {
  }

  async findSocioeconomicFormAll(schoolPeriodId: string) {
    const queryBuilder: SelectQueryBuilder<StudentEntity> = this.repository.createQueryBuilder('students');

    queryBuilder.select([
      'careers.code AS "Código Carrera"',
      'careers.name AS "Carrera"',
      'users.identification AS "Número de Documento"',
      'users.lastname AS "Apellidos"',
      'users.name AS "Nombres"',
      'users.cell_phone AS "Celular"',
      'users.phone AS "Teléfono convencional"',
      'users.email AS "Mail institucional"',
      'users.personal_email AS "Mail personal"',
      'users.identification AS "Número de Documento"',
      'users.lastname AS "Apellidos"',
      'users.name AS "Nombres"',
      'users.cell_phone AS "Celular"',
      'users.phone AS "Teléfono convencional"',
      'users.email AS "Mail institucional"',
      'users.personal_email AS "Mail personal"',
      'parallels.name AS "Paralelo"',
      'types.name AS "Tipo de Matricula"',
      'enrollments.date AS "Fecha de Matrícula"',
      'enrollments.applications_at AS "Fecha de Envío de Solicitud"',
      'states_enrollment.name AS "Estado"',
      'users.birthdate AS "Fecha de nacimiento"',
      'genders.name AS "Genero"',
      'sexes.name AS "Sexo"',
      'marital_statuses.name AS "Estado civil"',
      'nationalities.name AS "Nacionalidad"',
      'ethnic_origins.name AS "Autoidentificacion"',
      'indigenous_nationalities.name AS "Nacionalidad Indígena"',
      'town.name AS "Pueblo Indigena"',
      'is_ancestral_languages.name AS "Habla Lengua ancestral"',
      'ancestral_language_name.name AS "Lengua Ancestral"',
      'foreign_languages.name AS "Habla Lengua extranjera"',
      'foreign_languages_names.name AS "Lengua extranjera"',
      'student_info.contact_emergency_name AS "Nombre contacto de emergencia"',
      'student_info.contact_emergency_phone AS "Numero contacto de emergencia"',
      'contact_emergency_kinships.name AS "Contacto de emergencia - Relación"',
      'works.name AS "Trabajo"',
      'student_info.work_position AS "Cargo de trabajo"',
      'working_hours.name AS "Horario de trabajo"',
      'monthly_salaries.name AS "Sueldo mensual"',
      'student_info.work_address AS "Dirección trabajo"',
      'is_has_children.name AS "Cargas familiares - Hijos"',
      'student_info.children_total AS "Total hijos"',
      'house_heads.name AS "Jefe de hogar"',
      'social_securities.name AS "Afiliación Seguro social"',
      'private_securities.name AS "Afiliación Seguro privado"',
      'disabilities.name AS "Discapacidad"',
      'disability_types.name AS "Tipo de Discapacidad"',
      'student_info.disability_percentage AS "Porcentaje de discapacidad"',
      'catastrophic_illnesses.name AS "Enfermedad catastrófica"',
      'student_info.catastrophic_illness AS "Tipo Enfermedad catastrófica"',
      'school_types.name AS "Tipo de colegio"',
      'university_trajectory.name AS "Trayectoria Universitaria"',
      'is_degree_superior.name AS "Tiene otro titulo académico"',
      'degree_superiors.name AS "Titulo académico"',
      'is_study_other_careers.name AS "Estudia otra carrera"',
      'student_info.name_study_other_career AS "Nombre de la Institución"',
      'studies_other_careers.name AS "Tipo de institución"',
      'is_electronic_devices.name AS "Posee equipo electrónico"',
      'electronic_devices.name AS "Equipo electrónico"',
      'is_internet.name AS "Cobertura internet"',
      'internet_types.name AS "Tipo de cobertura a internet"',
      'countries.name AS "Pais de origen"',
      'province_origins.name AS "Provincia de origen"',
      'canton_origins.name AS "Canton de origen"',
      'parish_origins.name AS "Parroquia de origen"',
      'province_residences.name AS "Provincia de residencia"',
      'canton_residences.name AS "Canton de residencia"',
      'parish_residences.name AS "Parroquia de residencia"',
      'residence_addresses.community AS "Comunidad de residencia"',
      'residence_addresses.latitude AS "Latitud residencia"',
      'residence_addresses.longitude AS "Longitud residencia"',
      'residence_addresses.main_street AS "Calle principal residencia"',
      'residence_addresses.secondary_street AS "Calle secundaria residencia"',
      'residence_addresses.number AS "Numero de casa"',
      'residence_addresses.nearby_city AS "Ciudad mas cercana a residencia"',
      'residence_addresses.reference AS "Referencia a residencia"',
      'student_info.members_house_number AS "Integrantes nucleo familiar"',
      'family_incomes.name AS "Ingreso Familiar"',
      'is_family_vehicle.name AS "Vehículo"',
      'is_family_properties.name AS "Tiene propiedades familiares"',
      'family_properties.name AS "Tipo de Propiedades familiares"',
      'is_family_catastrophic_illness.name AS "Familiar con enfermedad catastrófica"',
      'family_kinship_catastrophic_illness.name AS "Miembro de familia con enfermedad catastrófica"',
      'student_info.family_catastrophic_illness AS "Tipo de enfermedad catastrófica del familiar"',
      'is_family_disabilities.name AS "Familiar con discapacidad"',
      'family_kinship_disabilities.name AS "Miembro de la familia con discapacidad"',
      'family_disability_percentage AS "Porcentaje de discapacidad del familiar"',
      'student_live_with.name AS "Con quien vive el estudiante"',
      'home_ownerships.name AS "Vivienda en la que vive el estudiante"',
      'home_types.name AS "Tipo de vivienda"',
      'home_roofs.name AS "Tipo de techo - vivienda"',
      'home_floors.name AS "Tipo de piso - vivienda"',
      'home_walls.name AS "Tipo de pared - vivienda"',
      'water_services.name AS "Servicio de agua"',
      'water_service_types.name AS "Tipo de servicio de agua"',
      'electric_services.name AS "Posee servicio eléctrico"',
      'electric_blackouts.name AS "Cortes eléctricos"',
      'phone_services.name AS "Servicio de teléfono convencional"',
      'sewerage_services.name AS "Servicio de alcantarillado"',
      'sewerage_service_types.name AS "Tipo de servicio de alcantarillado"',
      'economic_dependencies.name AS "Dependencia económica"',
      'economic_contributions.name AS "Aporte economico"',
      'is_family_economic_aids.name AS "Familiar con beca, bono o ayuda economica"',
      'consume_news_types.name AS "Consumo de Noticias"',
      'family_emigrants.name AS "Familia migrante"',
      'pandemic_psychological_effects.name AS "Efecto psicosocial de la pandemia"',
      'gender_violences.name AS "Violencia de genero"',
      'type_gender_violence.name AS "Tipo de violencia de genero"',
      'injuries.name AS "Pensamiento autoliticos"',
      'type_injuries.name AS "Tipo de lesiones"',
      'discriminations.name AS "Discriminación"',
      'type_discriminations.name AS "Tipo de discriminación"',
      'social_group.name AS "Tribu urbana"',
      'student_info.additional_information AS "informacion adicional del estudiante"',
    ])
      .innerJoin(EnrollmentEntity, 'enrollments', 'enrollments.student_id = students.id')
      .innerJoin(EnrollmentStateEntity, 'enrollment_states', 'enrollment_states.enrollment_id = enrollments.id')
      .innerJoin(CatalogueEntity, 'states_enrollment', 'states_enrollment.id = enrollment_states.state_id')
      .innerJoin(CatalogueEntity, 'types', 'types.id = enrollments.type_id')
      .leftJoin(CatalogueEntity, 'parallels', 'parallels.id = enrollments.parallel_id')
      .innerJoin(CareerEntity, 'careers', 'careers.id = enrollments.career_id')
      .innerJoin(UserEntity, 'users', 'users.id = students.user_id')
      .leftJoin(CatalogueEntity, 'blood_types', 'blood_types.id = users.blood_type_id')
      .leftJoin(CatalogueEntity, 'ethnic_origins', 'ethnic_origins.id = users.ethnic_origin_id')
      .leftJoin(CatalogueEntity, 'genders', 'genders.id = users.gender_id')
      .leftJoin(CatalogueEntity, 'sexes', 'sexes.id = users.sex_id')
      .leftJoin(CatalogueEntity, 'marital_statuses', 'marital_statuses.id = users.marital_status_id')
      .leftJoin(CatalogueEntity, 'nationalities', 'nationalities.id = users.nationality_id')
      .leftJoin(OriginAddressEntity, 'origin_addresses', 'origin_addresses.model_id = users.id')
      .leftJoin(LocationEntity, 'countries', 'countries.id = origin_addresses.country_id')
      .leftJoin(LocationEntity, 'province_origins', 'province_origins.id = origin_addresses.province_id')
      .leftJoin(LocationEntity, 'canton_origins', 'canton_origins.id = origin_addresses.canton_id')
      .leftJoin(LocationEntity, 'parish_origins', 'parish_origins.id = origin_addresses.parish_id')
      .leftJoin(ResidenceAddressEntity, 'residence_addresses', 'residence_addresses.model_id = users.id')
      .leftJoin(LocationEntity, 'province_residences', 'province_residences.id = residence_addresses.province_id')
      .leftJoin(LocationEntity, 'canton_residences', 'canton_residences.id = residence_addresses.canton_id')
      .leftJoin(LocationEntity, 'parish_residences', 'parish_residences.id = residence_addresses.parish_id')
      .leftJoin(InformationStudentEntity, 'student_info', 'student_info.student_id = students.id')
      .leftJoin(CatalogueEntity, 'academic_periods', 'academic_periods.id = enrollments.academic_period_id')
      .leftJoin(CatalogueEntity, 'catastrophic_illnesses', 'catastrophic_illnesses.id = student_info.is_catastrophic_illness_id')
      .leftJoin(CatalogueEntity, 'consume_news_types', 'consume_news_types.id = student_info.consume_news_type_id')
      .leftJoin(CatalogueEntity, 'contact_emergency_kinships', 'contact_emergency_kinships.id = student_info.contact_emergency_kinship_id')
      .leftJoin(CatalogueEntity, 'degree_superiors', 'degree_superiors.id = student_info.degree_superior_id')
      .leftJoin(CatalogueEntity, 'disability_types', 'disability_types.id = student_info.disability_type_id')
      .leftJoin(CatalogueEntity, 'electric_blackouts', 'electric_blackouts.id = student_info.electric_service_blackout_id')
      .leftJoin(CatalogueEntity, 'electronic_devices', 'electronic_devices.id = student_info.electronic_device_id')
      .leftJoin(CatalogueEntity, 'family_kinship_catastrophic_illness', 'family_kinship_catastrophic_illness.id = student_info.family_kinship_catastrophic_illness_id')
      .leftJoin(CatalogueEntity, 'is_family_catastrophic_illness', 'is_family_catastrophic_illness.id = student_info.is_family_catastrophic_illness_id')
      .leftJoin(CatalogueEntity, 'is_family_disabilities', 'is_family_disabilities.id = student_info.is_family_disability_id')
      .leftJoin(CatalogueEntity, 'family_kinship_disabilities', 'family_kinship_disabilities.id = student_info.family_kinship_disability_id')
      .leftJoin(CatalogueEntity, 'family_incomes', 'family_incomes.id = student_info.family_income_id')
      .leftJoin(CatalogueEntity, 'family_properties', 'family_properties.id = student_info.family_properties_id')
      .leftJoin(CatalogueEntity, 'foreign_languages_names', 'foreign_languages_names.id = student_info.foreign_language_name_id')
      .leftJoin(CatalogueEntity, 'home_floors', 'home_floors.id = student_info.home_floor_id')
      .leftJoin(CatalogueEntity, 'home_ownerships', 'home_ownerships.id = student_info.home_ownership_id')
      .leftJoin(CatalogueEntity, 'home_roofs', 'home_roofs.id = student_info.home_roof_id')
      .leftJoin(CatalogueEntity, 'home_types', 'home_types.id = student_info.home_type_id')
      .leftJoin(CatalogueEntity, 'home_walls', 'home_walls.id = student_info.home_wall_id')
      .leftJoin(CatalogueEntity, 'indigenous_nationalities', 'indigenous_nationalities.id = student_info.indigenous_nationality_id')
      .leftJoin(CatalogueEntity, 'internet_types', 'internet_types.id = student_info.internet_type_id')
      .leftJoin(CatalogueEntity, 'is_ancestral_languages', 'is_ancestral_languages.id = student_info.is_ancestral_language_id')
      .leftJoin(CatalogueEntity, 'ancestral_language_name', 'ancestral_language_name.id = student_info.ancestral_language_name_id')
      .leftJoin(CatalogueEntity, 'is_degree_superior', 'is_degree_superior.id = student_info.is_degree_superior_id')
      .leftJoin(CatalogueEntity, 'economic_dependencies', 'economic_dependencies.id = student_info.is_depends_economically_id')
      .leftJoin(CatalogueEntity, 'disabilities', 'disabilities.id = student_info.is_disability_id')
      .leftJoin(CatalogueEntity, 'discriminations', 'discriminations.id = student_info.is_discrimination_id')
      .leftJoin(CatalogueEntity, 'economic_contributions', 'economic_contributions.id = student_info.economic_contribution_id')
      .leftJoin(CatalogueEntity, 'electric_services', 'electric_services.id = student_info.is_electric_service_id')
      .leftJoin(CatalogueEntity, 'is_electronic_devices', 'is_electronic_devices.id = student_info.is_electronic_device_id')
      .leftJoin(CatalogueEntity, 'is_executed_community', 'is_executed_community.id = student_info.is_executed_community')
      .leftJoin(CatalogueEntity, 'is_executed_practices', 'is_executed_practices.id = student_info.is_executed_practice_id')
      .leftJoin(CatalogueEntity, 'is_family_economic_aids', 'is_family_economic_aids.id = student_info.is_family_economic_aid_id')
      .leftJoin(CatalogueEntity, 'family_emigrants', 'family_emigrants.id = student_info.is_family_emigrant_id')
      .leftJoin(CatalogueEntity, 'is_family_properties', 'is_family_properties.id = student_info.is_family_properties_id')
      .leftJoin(CatalogueEntity, 'is_family_vehicle', 'is_family_vehicle.id = student_info.is_family_vehicle_id')
      .leftJoin(CatalogueEntity, 'foreign_languages', 'foreign_languages.id = student_info.is_foreign_language_id')
      .leftJoin(CatalogueEntity, 'gender_violences', 'gender_violences.id = student_info.is_gender_violence_id')
      .leftJoin(CatalogueEntity, 'is_has_children', 'is_has_children.id = student_info.is_has_children_id')
      .leftJoin(CatalogueEntity, 'house_heads', 'house_heads.id = student_info.is_house_head_id')
      .leftJoin(CatalogueEntity, 'injuries', 'injuries.id = student_info.is_injuries_id')
      .leftJoin(CatalogueEntity, 'is_internet', 'is_internet.id = student_info.is_internet_id')
      .leftJoin(CatalogueEntity, 'is_lost_gratuities', 'is_lost_gratuities.id = student_info.is_lost_gratuity_id')
      .leftJoin(CatalogueEntity, 'phone_services', 'phone_services.id = student_info.is_phone_service_id')
      .leftJoin(CatalogueEntity, 'private_securities', 'private_securities.id = student_info.is_private_security_id')
      .leftJoin(CatalogueEntity, 'sewerage_services', 'sewerage_services.id = student_info.is_sewerage_service_id')
      .leftJoin(CatalogueEntity, 'social_securities', 'social_securities.id = student_info.is_social_security_id')
      .leftJoin(CatalogueEntity, 'is_study_other_careers', 'is_study_other_careers.id = student_info.is_study_other_career_id')
      .leftJoin(CatalogueEntity, 'is_subject_losts', 'is_subject_losts.id = student_info.is_subject_lost_id')
      .leftJoin(CatalogueEntity, 'water_services', 'water_services.id = student_info.is_water_service_id')
      .leftJoin(CatalogueEntity, 'works', 'works.id = student_info.is_work_id')
      .leftJoin(CatalogueEntity, 'monthly_salaries', 'monthly_salaries.id = student_info.monthly_salary_id')
      .leftJoin(CatalogueEntity, 'pandemic_psychological_effects', 'pandemic_psychological_effects.id = student_info.pandemic_psychological_effect_id')
      .leftJoin(CatalogueEntity, 'social_group', 'social_group.id = student_info.social_group_id')
      .leftJoin(CatalogueEntity, 'student_live_with', 'student_live_with.id = student_info.student_live_id')
      .leftJoin(CatalogueEntity, 'town', 'town.id = student_info.town_id')
      .leftJoin(CatalogueEntity, 'type_discriminations', 'type_discriminations.id = student_info.type_discrimination_id')
      .leftJoin(CatalogueEntity, 'type_gender_violence', 'type_gender_violence.id = student_info.type_gender_violence_id')
      .leftJoin(CatalogueEntity, 'type_injuries', 'type_injuries.id = student_info.type_injuries_id')
      .leftJoin(CatalogueEntity, 'school_types', 'school_types.id = student_info.type_school_id')
      .leftJoin(CatalogueEntity, 'studies_other_careers', 'studies_other_careers.id = student_info.type_study_other_career_id')
      .leftJoin(CatalogueEntity, 'university_trajectory', 'university_trajectory.id = student_info.university_career_id')
      .leftJoin(CatalogueEntity, 'sewerage_service_types', 'sewerage_service_types.id = student_info.sewerage_service_type_id')
      .leftJoin(CatalogueEntity, 'water_service_types', 'water_service_types.id = student_info.water_service_type_id')
      .leftJoin(CatalogueEntity, 'working_hours', 'working_hours.id = student_info.working_hours_id')
      .where(`enrollments.school_period_id = :schoolPeriodId 
                      AND enrollment_states.deleted_at IS NULL 
                      AND (states_enrollment.code = 'approved' OR states_enrollment.code = 'enrolled')`,
        { schoolPeriodId })
      .orderBy('careers.name, users.lastname, users.name');

    return await queryBuilder.getRawMany();
  }

  async findSocioeconomicForm(id: string): Promise<StudentEntity> {
    const student = await this.repository.findOne({
      relations: {
        careers: true,
        informationStudent: {
          ancestralLanguageName: true,
          consumeNewsType: true,
          contactEmergencyKinship: true,
          degreeSuperior: true,
          disabilityType: true,
          economicContribution: true,
          electricServiceBlackout: true,
          electronicDevice: true,
          familyIncome: true,
          familyKinshipCatastrophicIllness: true,
          familyKinshipDisability: true,
          familyProperties: true,
          foreignLanguageName: true,
          homeFloor: true,
          homeOwnership: true,
          homeRoof: true,
          homeType: true,
          homeWall: true,
          indigenousNationality: true,
          internetType: true,
          isAncestralLanguage: true,
          isCatastrophicIllness: true,
          isDegreeSuperior: true,
          isDependsEconomically: true,
          isDisability: true,
          isDiscrimination: true,
          isElectricService: true,
          isElectronicDevice: true,
          isFamilyCatastrophicIllness: true,
          isFamilyDisability: true,
          isFamilyEconomicAid: true,
          isFamilyEmigrant: true,
          isFamilyProperties: true,
          isFamilyVehicle: true,
          isForeignLanguage: true,
          isGenderViolence: true,
          isHasChildren: true,
          isHouseHead: true,
          isInjuries: true,
          isInternet: true,
          isLostGratuity: true,
          isPhoneService: true,
          isPrivateSecurity: true,
          isSewerageService: true,
          isSocialSecurity: true,
          isStudyOtherCareer: true,
          isWaterService: true,
          isWork: true,
          monthlySalary: true,
          pandemicPsychologicalEffect: true,
          sewerageServiceType: true,
          socialGroup: true,
          studentLive: true,
          town: true,
          typeDiscrimination: true,
          typeGenderViolence: true,
          typeInjuries: true,
          typeSchool: true,
          typeStudyOtherCareer: true,
          universityCareer: true,
          waterServiceType: true,
          workingHours: true,
        },
        user: {
          identificationType: true,
          maritalStatus: true,
          nationality: true,
          sex: true,
          gender: true,
          ethnicOrigin: true,
          originAddress: {
            country: true,
            province: true,
            canton: true,
            parish: true,
          },
          residenceAddress: {
            country: true,
            province: true,
            canton: true,
            parish: true,
          },
        },
      },
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    return student;
  }

  async findStudentCard(id: string, careerId: string, schoolPeriodId: string): Promise<StudentEntity[]> {
    const catalogues = await this.cataloguesService.findCache();
    const enrollmentStateEnrolled = catalogues.find(catalogue => catalogue.code === CatalogueEnrollmentStateEnum.ENROLLED && catalogue.type === CatalogueTypeEnum.ENROLLMENT_STATE);

    const student = await this.repository.find({
      relations: {
        informationStudent: { town: true, indigenousNationality: true },
        enrollments: { career: true, schoolPeriod: true },
        user: {
          ethnicOrigin: true,
          sex: true,
          residenceAddress: {
            province: true,
            canton: true,
          },
        },
      },
      where: {
        id,
        enrollments: {
          careerId: careerId,
          schoolPeriodId: schoolPeriodId,
          enrollmentStates: { stateId: enrollmentStateEnrolled.id },
        },
      },
    });

    if (!student.length) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    return student;
  }
}

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FilterStudentDto, PaginationDto, UpdateStudentDto } from '@core/dto';
import { StudentEntity } from '@core/entities';
import {
  AuthRepositoryEnum, CatalogueEconomicContributionEnum,
  CatalogueEthnicOriginEnum,
  CatalogueMaritalStatusEnum, CatalogueStudentLiveEnum, CatalogueTypeSchoolEnum,
  CatalogueYesNoEnum,
  CoreRepositoryEnum,
} from '@shared/enums';
import { InformationStudentsService } from './information-students.service';
import { ServiceResponseHttpModel } from '@shared/models';
import { OriginAddressesService } from './origin-addresses.service';
import { ResidenceAddressesService } from './residence-addresses.service';
import { UsersService } from '../../auth/services/users.service';
import { UpdateUserDto } from '@auth/dto';
import { UserEntity } from '@auth/entities';

@Injectable()
export class StudentsService {
  constructor(
    @Inject(CoreRepositoryEnum.STUDENT_REPOSITORY) private readonly repository: Repository<StudentEntity>,
    @Inject(AuthRepositoryEnum.USER_REPOSITORY) private readonly userRepository: Repository<UserEntity>,
    private readonly informationStudentsService: InformationStudentsService,
    private readonly originAddressesService: OriginAddressesService,
    private readonly residenceAddressesService: ResidenceAddressesService,
  ) {
  }

  async catalogue() {
    const data = await this.repository.findAndCount({
      take: 1000,
    });

    return { pagination: { totalItems: data[1], limit: 10 }, data: data[0] };
  }

  async findAll(params?: FilterStudentDto): Promise<ServiceResponseHttpModel> {
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params);
    }

    //Filter by other field

    //All
    const data = await this.repository.findAndCount({
      relations: ['user', 'informationStudent'],
    });

    return { pagination: { totalItems: data[1], limit: 10 }, data: data[0] };
  }

  async findOne(id: string): Promise<StudentEntity> {
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

  async update(id: string, payload: UpdateStudentDto): Promise<StudentEntity> {
    const student = await this.repository.findOneBy({ id });

    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    this.repository.merge(student, payload);

    await this.repository.save(student);

    await this.updateUser(payload.user.id, payload.user);

    payload.informationStudent.student = await this.repository.save(student);

    if (payload.informationStudent?.id) {
      await this.informationStudentsService.update(payload.informationStudent.id, payload.informationStudent);
    } else {
      const { id, ...informationStudentRest } = payload.informationStudent;
      await this.informationStudentsService.create(informationStudentRest);
    }

    return student;
  }

  async updateCareers(id: string, payload: UpdateStudentDto): Promise<StudentEntity> {
    const student = await this.repository.findOneBy({ id });

    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    this.repository.merge(student, payload);

    await this.repository.save(student);

    return student;
  }

  async remove(id: string) {
    const student = await this.repository.findOneBy({ id });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return await this.repository.softRemove(student);
  }

  async removeAll(payload: StudentEntity[]) {
    return this.repository.softRemove(payload);
  }

  private async paginateAndFilter(params: FilterStudentDto) {
    let where: FindOptionsWhere<StudentEntity> | FindOptionsWhere<StudentEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      // where.push({ name: ILike(`%${search}%`) });
    }

    const data = await this.repository.findAndCount({
      relations: { informationStudent: true, user: true },
      where,
      take: limit,
      skip: PaginationDto.getOffset(limit, page),
    });

    return { pagination: { limit, totalItems: data[1] }, data: data[0] };
  }

  async create(payload: any): Promise<any> {
    const newEntity = this.repository.create(payload);
    return await this.repository.save(newEntity);
  }

  async updatePersonalInformation(id: string, payload: UpdateStudentDto): Promise<StudentEntity> {
    const student = await this.repository.findOne({
      relations: { informationStudent: true, user: true },
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    student.user.identificationTypeId = payload.user.identificationType.id;
    student.user.identification = payload.user.identification;
    student.user.name = payload.user.name;
    student.user.lastname = payload.user.lastname;
    student.user.birthdate = payload.user.birthdate;
    student.user.maritalStatusId = payload.user.maritalStatus.id;
    student.user.nationalityId = payload.user.nationality.id;
    student.user.genderId = payload.user.gender.id;
    student.user.sexId = payload.user.sex.id;
    student.user.ethnicOriginId = payload.user.ethnicOrigin.id;
    student.user.cellPhone = payload.user.cellPhone;
    student.user.phone = payload.user.phone;
    student.user.personalEmail = payload.user.personalEmail;
    student.user.email = payload.user.email;

    await this.updateUser(student.userId, student.user);

    student.informationStudent.contactEmergencyName = payload.informationStudent.contactEmergencyName;
    student.informationStudent.contactEmergencyPhone = payload.informationStudent.contactEmergencyPhone;
    student.informationStudent.contactEmergencyKinship = payload.informationStudent.contactEmergencyKinship;
    student.informationStudent.isWorkId = payload.informationStudent.isWork.id;
    student.informationStudent.workAddress = payload.informationStudent.workAddress;
    student.informationStudent.monthlySalary = payload.informationStudent.monthlySalary;
    student.informationStudent.workingHours = payload.informationStudent.workingHours;
    student.informationStudent.workPosition = payload.informationStudent.workPosition;
    student.informationStudent.isHouseHeadId = payload.informationStudent.isHouseHead.id;
    student.informationStudent.isSocialSecurityId = payload.informationStudent.isSocialSecurity.id;
    student.informationStudent.isPrivateSecurityId = payload.informationStudent.isPrivateSecurity.id;

    // Conditional Field
    student.informationStudent.isHasChildrenId = payload.informationStudent.isHasChildren.id;

    student.informationStudent.childrenTotal = payload.informationStudent.isHasChildren.code === CatalogueYesNoEnum.YES
      ? payload.informationStudent.childrenTotal : null;

    // Conditional Field
    student.informationStudent.indigenousNationalityId = payload.user.ethnicOrigin.code === CatalogueEthnicOriginEnum.INDIGENOUS
      ? payload.informationStudent.indigenousNationality?.id : null;

    student.informationStudent.townId = payload.user.ethnicOrigin.code === CatalogueEthnicOriginEnum.INDIGENOUS
      ? payload.informationStudent.town?.id : null;

    // Conditional Field
    student.informationStudent.isDisabilityId = payload.informationStudent.isDisability.id;

    student.informationStudent.disabilityTypeId = payload.informationStudent.isDisability.code === CatalogueYesNoEnum.YES
      ? payload.informationStudent.disabilityType.id : null;

    student.informationStudent.disabilityPercentage = payload.informationStudent.isDisability.code === CatalogueYesNoEnum.YES
      ? payload.informationStudent.disabilityPercentage : null;

    // Conditional Field
    student.informationStudent.isAncestralLanguageId = payload.informationStudent.isAncestralLanguage.id;

    student.informationStudent.ancestralLanguageNameId = payload.informationStudent.isAncestralLanguage.code === CatalogueYesNoEnum.YES
      ? payload.informationStudent.ancestralLanguageName.id : null;

    // Conditional Field
    student.informationStudent.isForeignLanguageId = payload.informationStudent.isForeignLanguage.id;

    student.informationStudent.foreignLanguageNameId = payload.informationStudent.isForeignLanguage.code === CatalogueYesNoEnum.YES
      ? payload.informationStudent.foreignLanguageName.id : null;

    // Conditional Field
    student.informationStudent.isCatastrophicIllnessId = payload.informationStudent.isCatastrophicIllness.id;

    student.informationStudent.catastrophicIllness = payload.informationStudent.isCatastrophicIllness.code === CatalogueYesNoEnum.YES
      ? payload.informationStudent.catastrophicIllness : null;

    await this.informationStudentsService.update(student.informationStudent.id, student.informationStudent);

    return student;
  }

  async updateAcademicData(id: string, payload: UpdateStudentDto): Promise<StudentEntity> {
    const student = await this.repository.findOne({
      relations: { informationStudent: true },
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    student.informationStudent.universityCareerId = payload.informationStudent.universityCareer.id;
    student.informationStudent.typeSchoolId = payload.informationStudent.typeSchool.id;

    // Conditional Field
    student.informationStudent.isDegreeSuperiorId = payload.informationStudent.isDegreeSuperior.id;

    student.informationStudent.degreeSuperiorId =
      payload.informationStudent.isDegreeSuperior.code === CatalogueYesNoEnum.YES
        ? payload.informationStudent.degreeSuperior.id : null;

    // Conditional Field
    student.informationStudent.isStudyOtherCareerId = payload.informationStudent.isStudyOtherCareer.id;

    student.informationStudent.nameStudyOtherCareer =
      payload.informationStudent.isStudyOtherCareer.code === CatalogueYesNoEnum.YES
        ? payload.informationStudent.nameStudyOtherCareer : null;

    student.informationStudent.typeStudyOtherCareerId =
      payload.informationStudent.isStudyOtherCareer.code === CatalogueYesNoEnum.YES
        ? payload.informationStudent.typeStudyOtherCareer?.id : null;

    await this.informationStudentsService.update(student.informationStudent.id, student.informationStudent);

    return student;
  }

  async updateOtherAcademicData(id: string, payload: UpdateStudentDto): Promise<StudentEntity> {
    const student = await this.repository.findOne({
      relations: { informationStudent: true },
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    // Conditional Field
    student.informationStudent.isElectronicDeviceId = payload.informationStudent.isElectronicDevice.id;

    student.informationStudent.electronicDeviceId =
      payload.informationStudent.isElectronicDevice.code === CatalogueYesNoEnum.YES
        ? payload.informationStudent.electronicDevice.id : null;

    // Conditional Field
    student.informationStudent.isInternetId = payload.informationStudent.isInternet.id;

    student.informationStudent.internetTypeId =
      payload.informationStudent.isInternet.code === CatalogueYesNoEnum.YES
        ? payload.informationStudent.internetType.id : null;

    await this.informationStudentsService.update(student.informationStudent.id, student.informationStudent);

    return student;
  }

  async updateOriginPlace(id: string, payload: UpdateStudentDto): Promise<StudentEntity> {
    const student = await this.repository.findOne({
      relations: { user: { originAddress: true } },
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    if (!student.user?.originAddress) {
      await this.originAddressesService.create(
        {
          cantonId: payload.user.originAddress.canton?.id,
          countryId: payload.user.originAddress.country?.id,
          community: payload.user.originAddress.community,
          latitude: payload.user.originAddress.latitude,
          longitude: payload.user.originAddress.longitude,
          mainStreet: payload.user.originAddress.mainStreet,
          modelId: student.user.id,
          number: payload.user.originAddress.number,
          parishId: payload.user.originAddress.parish?.id,
          postCode: payload.user.originAddress.postCode,
          provinceId: payload.user.originAddress.province?.id,
          reference: payload.user.originAddress.reference,
          secondaryStreet: payload.user.originAddress.secondaryStreet,
        },
      );
    } else {
      await this.originAddressesService.update(
        student.user.originAddress.id,
        {
          cantonId: payload.user.originAddress.canton?.id,
          community: payload.user.originAddress.community,
          latitude: payload.user.originAddress.latitude,
          longitude: payload.user.originAddress.longitude,
          mainStreet: payload.user.originAddress.mainStreet,
          number: payload.user.originAddress.number,
          parishId: payload.user.originAddress.parish?.id,
          postCode: payload.user.originAddress.postCode,
          provinceId: payload.user.originAddress.province?.id,
          reference: payload.user.originAddress.reference,
          secondaryStreet: payload.user.originAddress.secondaryStreet,
        },
      );
    }

    return student;
  }

  async updateResidencePlace(id: string, payload: UpdateStudentDto): Promise<StudentEntity> {
    const student = await this.repository.findOne({
      relations: { user: { residenceAddress: true } },
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    if (!student.user.residenceAddress) {
      await this.residenceAddressesService.create(
        {
          cantonId: payload.user.residenceAddress.canton?.id,
          countryId: payload.user.residenceAddress.country?.id,
          latitude: payload.user.residenceAddress.latitude,
          longitude: payload.user.residenceAddress.longitude,
          mainStreet: payload.user.residenceAddress.mainStreet,
          modelId: student.user.id,
          nearbyCity: payload.user.residenceAddress.nearbyCity,
          number: payload.user.residenceAddress.number,
          parishId: payload.user.residenceAddress.parish?.id,
          postCode: payload.user.residenceAddress.postCode,
          provinceId: payload.user.residenceAddress.province?.id,
          reference: payload.user.residenceAddress.reference,
          secondaryStreet: payload.user.residenceAddress.secondaryStreet,
        },
      );
    } else {
      await this.residenceAddressesService.update(
        student.user.residenceAddress.id,
        {
          cantonId: payload.user.residenceAddress.canton?.id,
          latitude: payload.user.residenceAddress.latitude,
          longitude: payload.user.residenceAddress.longitude,
          mainStreet: payload.user.residenceAddress.mainStreet,
          nearbyCity: payload.user.residenceAddress.nearbyCity,
          number: payload.user.residenceAddress.number,
          parishId: payload.user.residenceAddress.parish?.id,
          postCode: payload.user.residenceAddress.postCode,
          provinceId: payload.user.residenceAddress.province?.id,
          reference: payload.user.residenceAddress.reference,
          secondaryStreet: payload.user.residenceAddress.secondaryStreet,
        },
      );
    }

    return student;
  }

  async updateFamilyGroup(id: string, payload: UpdateStudentDto): Promise<StudentEntity> {
    const student = await this.repository.findOne({
      relations: { informationStudent: true },
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    student.informationStudent.membersHouseNumber = payload.informationStudent.membersHouseNumber;
    student.informationStudent.familyIncome = payload.informationStudent.familyIncome;
    student.informationStudent.isDependsEconomicallyId = payload.informationStudent.isDependsEconomically.id;

    await this.informationStudentsService.update(student.informationStudent.id, student.informationStudent);

    return student;
  }

  async updateFamilyEconomic(id: string, payload: UpdateStudentDto): Promise<StudentEntity> {
    const student = await this.repository.findOne({
      relations: { informationStudent: true },
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    student.informationStudent.isFamilyVehicleId = payload.informationStudent.isFamilyVehicle.id;
    student.informationStudent.isFamilyPropertiesId = payload.informationStudent.isFamilyProperties.id;

    student.informationStudent.familyPropertiesId = payload.informationStudent.isFamilyProperties.code === CatalogueYesNoEnum.YES
      ? payload.informationStudent.familyProperties.id : null;

    await this.informationStudentsService.update(student.informationStudent.id, student.informationStudent);

    return student;
  }

  async updateFamilyHealth(id: string, payload: UpdateStudentDto): Promise<StudentEntity> {
    const student = await this.repository.findOne({
      relations: { informationStudent: true },
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    // Conditional Field
    student.informationStudent.isFamilyCatastrophicIllnessId = payload.informationStudent.isFamilyCatastrophicIllness.id;

    student.informationStudent.familyKinshipCatastrophicIllnessId =
      payload.informationStudent.isFamilyCatastrophicIllness.code === CatalogueYesNoEnum.YES
        ? payload.informationStudent.familyKinshipCatastrophicIllness.id : null;

    student.informationStudent.familyCatastrophicIllness =
      payload.informationStudent.isFamilyCatastrophicIllness.code === CatalogueYesNoEnum.YES
        ? payload.informationStudent.familyCatastrophicIllness : null;

    // Conditional Field
    student.informationStudent.isFamilyDisabilityId = payload.informationStudent.isFamilyDisability.id;
    student.informationStudent.familyKinshipDisabilityId =
      payload.informationStudent.isFamilyDisability.code === CatalogueYesNoEnum.YES
        ? payload.informationStudent.familyKinshipDisability.id : null;

    student.informationStudent.familyDisabilityPercentage =
      payload.informationStudent.isFamilyDisability.code === CatalogueYesNoEnum.YES
        ? payload.informationStudent.familyDisabilityPercentage : null;

    await this.informationStudentsService.update(student.informationStudent.id, student.informationStudent);

    return student;
  }

  async updateHousingData(id: string, payload: UpdateStudentDto): Promise<StudentEntity> {
    const student = await this.repository.findOne({
      relations: { informationStudent: true },
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    student.informationStudent.studentLiveId = payload.informationStudent.studentLive.id;
    student.informationStudent.homeOwnershipId = payload.informationStudent.homeOwnership.id;
    student.informationStudent.homeTypeId = payload.informationStudent.homeType.id;
    student.informationStudent.homeRoofId = payload.informationStudent.homeRoof.id;
    student.informationStudent.homeFloorId = payload.informationStudent.homeFloor.id;
    student.informationStudent.homeWallId = payload.informationStudent.homeWall.id;
    student.informationStudent.isPhoneServiceId = payload.informationStudent.isPhoneService.id;
    student.informationStudent.economicContributionId = payload.informationStudent.economicContribution.id;
    student.informationStudent.isFamilyEconomicAidId = payload.informationStudent.isFamilyEconomicAid.id;
    student.informationStudent.consumeNewsTypeId = payload.informationStudent.consumeNewsType.id;

    // Conditional Field
    student.informationStudent.isWaterServiceId = payload.informationStudent.isWaterService.id;

    student.informationStudent.waterServiceTypeId =
      payload.informationStudent.isWaterService.code === CatalogueYesNoEnum.YES
        ? payload.informationStudent.waterServiceType.id : null;

    // Conditional Field
    student.informationStudent.isElectricServiceId = payload.informationStudent.isElectricService.id;

    student.informationStudent.electricServiceBlackoutId =
      payload.informationStudent.isElectricService.code === CatalogueYesNoEnum.YES
        ? payload.informationStudent.electricServiceBlackout.id : null;

    // Conditional Field
    student.informationStudent.isSewerageServiceId = payload.informationStudent.isSewerageService.id;

    student.informationStudent.sewerageServiceTypeId =
      payload.informationStudent.isSewerageService.code === CatalogueYesNoEnum.YES
        ? payload.informationStudent.sewerageServiceType.id : null;

    await this.informationStudentsService.update(student.informationStudent.id, student.informationStudent);

    return student;
  }

  async updateMigrationCountry(id: string, payload: UpdateStudentDto): Promise<StudentEntity> {
    const student = await this.repository.findOne({
      relations: { informationStudent: true },
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    student.informationStudent.isFamilyEmigrantId = payload.informationStudent.isFamilyEmigrant.id;

    await this.informationStudentsService.update(student.informationStudent.id, student.informationStudent);

    return student;
  }

  async updatePsychosocialSection(id: string, payload: UpdateStudentDto): Promise<StudentEntity> {
    const student = await this.repository.findOne({
      relations: { informationStudent: true },
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    student.informationStudent.additionalInformation = payload.informationStudent.additionalInformation;
    student.informationStudent.pandemicPsychologicalEffectId = payload.informationStudent.pandemicPsychologicalEffect.id;
    student.informationStudent.socialGroupId = payload.informationStudent.socialGroup.id;

    student.informationStudent.isDiscriminationId = payload.informationStudent.isDiscrimination.id;
    student.informationStudent.typeDiscriminationId = payload.informationStudent.isDiscrimination.code === CatalogueYesNoEnum.YES
      ? payload.informationStudent.typeDiscrimination.id : null;

    student.informationStudent.isGenderViolenceId = payload.informationStudent.isGenderViolence.id;
    student.informationStudent.typeGenderViolenceId = payload.informationStudent.isGenderViolence.code === CatalogueYesNoEnum.YES
      ? payload.informationStudent.typeGenderViolence.id : null;

    student.informationStudent.isInjuriesId = payload.informationStudent.isInjuries.id;
    student.informationStudent.typeInjuriesId = payload.informationStudent.isInjuries.code === CatalogueYesNoEnum.YES
      ? payload.informationStudent.typeInjuries.id : null;

    await this.informationStudentsService.update(student.informationStudent.id, student.informationStudent);

    return student;
  }

  async calculateSocioeconomicFormScore(id: string): Promise<number> {
    const student = await this.repository.findOne({
      relations: {
        informationStudent: {
          economicContribution: true,
          isHasChildren: true,
          isHouseHead: true,
          isSocialSecurity: true,
          isPrivateSecurity: true,
          isDisability: true,
          isCatastrophicIllness: true,
          typeSchool: true,
          isElectronicDevice: true,
          familyIncome: true,
          isDependsEconomically: true,
          isFamilyProperties: true,
          isFamilyCatastrophicIllness: true,
          isFamilyDisability: true,
          studentLive: true,
          homeOwnership: true,
          homeType: true,
          homeRoof: true,
          homeFloor: true,
          homeWall: true,
          isWaterService: true,
          isElectricService: true,
          isInternet: true,
          isPhoneService: true,
          isSewerageService: true,
          isFamilyEconomicAid: true,
          isFamilyEmigrant: true,
        },
        user: { ethnicOrigin: true, maritalStatus: true, residenceAddress: { parish: true } },
      },
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    let score = 0;

    // Marital Status
    if (student.user.maritalStatus?.code === CatalogueMaritalStatusEnum.SINGLE) {
      score += 0.1875;
    }

    if (student.user.maritalStatus?.code === CatalogueMaritalStatusEnum.MARRIED) {
      score += 1.25;
    }

    if (student.user.maritalStatus?.code === CatalogueMaritalStatusEnum.DIVORCED) {
      score += 0.625;
    }

    if (student.user.maritalStatus?.code === CatalogueMaritalStatusEnum.FREE_UNION) {
      score += 1.25;
    }

    // Ethnic Origin
    if (student.user.ethnicOrigin?.code === CatalogueEthnicOriginEnum.WHITE) {
      score += 10;
    }

    if (student.user.ethnicOrigin?.code === CatalogueEthnicOriginEnum.HALF_BLOOD) {
      score += 10;
    }

    // Information Student
    // Is Has Children
    if (student.informationStudent.isHasChildren?.code === CatalogueYesNoEnum.YES) {
      score += 1.25;
    }

    if (student.informationStudent.isHasChildren?.code === CatalogueYesNoEnum.NO) {
      score += 2.5;
    }

    // Is House head
    if (student.informationStudent.isHouseHead?.code === CatalogueYesNoEnum.YES) {
      score += 3.5;
    }

    // Is Social Security
    if (student.informationStudent.isSocialSecurity?.code === CatalogueYesNoEnum.YES) {
      score += 2.5;
    }

    // Is Private Security
    if (student.informationStudent.isPrivateSecurity?.code === CatalogueYesNoEnum.YES) {
      score += 2.5;
    }

    // Is Disability
    if (student.informationStudent.isDisability?.code === CatalogueYesNoEnum.NO) {
      score += 2.5;
    }

    // Is Catastrophic Illness
    if (student.informationStudent.isCatastrophicIllness?.code === CatalogueYesNoEnum.NO) {
      score += 2.5;
    }

    // Type School
    if (student.informationStudent.typeSchool?.code === CatalogueTypeSchoolEnum.FISCAL) {
      score += 0.625;
    }

    if (student.informationStudent.typeSchool?.code === CatalogueTypeSchoolEnum.FISCOMISIONAL) {
      score += 1.25;
    }

    if (student.informationStudent.typeSchool?.code === CatalogueTypeSchoolEnum.PARTICULAR) {
      score += 1.875;
    }

    if (student.informationStudent.typeSchool?.code === CatalogueTypeSchoolEnum.MUNICIPAL) {
      score += 0.625;
    }

    // Is Electronic Device
    if (student.informationStudent.isElectronicDevice?.code === CatalogueYesNoEnum.YES) {
      score += 2;
    }

    // Is Internet
    if (student.informationStudent.isInternet?.code === CatalogueYesNoEnum.YES) {
      score += 2;
    }

    // Residence Address
    if (student.user?.residenceAddress?.parish?.zone.toLowerCase() === 'urbana') {
      score += 0.5;
    }

    if (student.user?.residenceAddress?.parish?.zone.toLowerCase() === 'rural') {
      score += 0.25;
    }

    // Members House Number
    if (student.informationStudent.membersHouseNumber === 1 || student.informationStudent.membersHouseNumber === 2) {
      score += 2.25;
    }

    if (student.informationStudent.membersHouseNumber === 3 || student.informationStudent.membersHouseNumber === 4) {
      score += 1.5;
    }

    if (student.informationStudent.membersHouseNumber >= 5) {
      score += 0.6;
    }

    // Family Income
    if (student.informationStudent.familyIncome?.code === '3') {
      score += 5;
    }

    if (student.informationStudent.familyIncome?.code === '4') {
      score += 10;
    }

    if (student.informationStudent.familyIncome?.code === '5') {
      score += 15;
    }

    if (student.informationStudent.familyIncome?.code === '6') {
      score += 20;
    }

    if (student.informationStudent.familyIncome?.code === '7') {
      score += 20;
    }

    // Is Family Properties
    if (student.informationStudent.isFamilyProperties?.code === CatalogueYesNoEnum.YES) {
      score += 2;
    }

    // Is Family Catastrophic Illness
    if (student.informationStudent.isFamilyCatastrophicIllness?.code === CatalogueYesNoEnum.NO) {
      score += 2;
    }

    // Is Family Disability
    if (student.informationStudent.isFamilyDisability?.code === CatalogueYesNoEnum.NO) {
      score += 2;
    }

    // Student Live
    if (student.informationStudent.studentLive?.code === CatalogueStudentLiveEnum.ALONE) {
      score += 0.5;
    }

    if (student.informationStudent.studentLive?.code === CatalogueStudentLiveEnum.BOTH_PARENTS) {
      score += 1;
    }

    if (student.informationStudent.studentLive?.code === CatalogueStudentLiveEnum.MOTHER) {
      score += 0.5;
    }

    if (student.informationStudent.studentLive?.code === CatalogueStudentLiveEnum.FATHER) {
      score += 0.5;
    }

    if (student.informationStudent.studentLive?.code === CatalogueStudentLiveEnum.SPOUSE) {
      score += 1;
    }

    if (student.informationStudent.studentLive?.code === CatalogueStudentLiveEnum.GRANDPARENTS) {
      score += 0.5;
    }

    if (student.informationStudent.studentLive?.code === CatalogueStudentLiveEnum.OTHER) {
      score += 0.5;
    }

    // Home Type
    if (student.informationStudent.homeType?.code === 'house') {
      score += 0.25;
    }

    if (student.informationStudent.homeType?.code === 'department') {
      score += 0.25;
    }

    if (student.informationStudent.homeType?.code === 'mediagua') {
      score += 0.1;
    }

    if (student.informationStudent.homeType?.code === 'ranch') {
      score += 0.5;
    }

    if (student.informationStudent.homeType?.code === 'room') {
      score += 0.15;
    }

    // Home Ownership
    if (student.informationStudent.homeOwnership?.code === 'mortgaged') {
      score += 0.25;
    }

    if (student.informationStudent.homeOwnership?.code === 'paid') {
      score += 0.75;
    }

    if (student.informationStudent.homeOwnership?.code === 'rented') {
      score += 0.25;
    }

    if (student.informationStudent.homeOwnership?.code === 'family') {
      score += 0.5;
    }

    if (student.informationStudent.homeOwnership?.code === 'shared') {
      score += 0.3;
    }

    if (student.informationStudent.homeOwnership?.code === 'other') {
      score += 0.25;
    }

    // Home Roof
    if (student.informationStudent.homeRoof?.code === 'ceramic') {
      score += 0.25;
    }

    if (student.informationStudent.homeRoof?.code === 'brick') {
      score += 5;
    }

    if (student.informationStudent.homeRoof?.code === 'other') {
      score += 0.25;
    }

    // Home Floor
    if (student.informationStudent.homeFloor?.code === 'ceramic') {
      score += 0.75;
    }

    if (student.informationStudent.homeFloor?.code === 'vinyl') {
      score += 0.25;
    }

    if (student.informationStudent.homeFloor?.code === 'brick') {
      score += 0.25;
    }

    if (student.informationStudent.homeFloor?.code === 'wood') {
      score += 0.5;
    }

    if (student.informationStudent.homeFloor?.code === 'untreated_board') {
      score += 0.25;
    }

    if (student.informationStudent.homeFloor?.code === 'cement') {
      score += 0.5;
    }

    if (student.informationStudent.homeFloor?.code === 'cane') {
      score += 0.25;
    }

    if (student.informationStudent.homeFloor?.code === 'other') {
      score += 0.25;
    }

    // Home Wall
    if (student.informationStudent.homeWall?.code === 'concrete') {
      score += 0.75;
    }

    if (student.informationStudent.homeWall?.code === 'brick') {
      score += 0.5;
    }

    if (student.informationStudent.homeWall?.code === 'wood') {
      score += 0.25;
    }

    if (student.informationStudent.homeWall?.code === 'adobe') {
      score += 0.15;
    }

    if (student.informationStudent.homeWall?.code === 'other') {
      score += 0.25;
    }

    // Is Water Service
    if (student.informationStudent.isWaterService?.code === CatalogueYesNoEnum.YES) {
      score += 2;
    }

    // Is Electric Service
    if (student.informationStudent.isElectricService?.code === CatalogueYesNoEnum.YES) {
      score += 2;
    }

    // Is Phone Service
    if (student.informationStudent.isPhoneService?.code === CatalogueYesNoEnum.YES) {
      score += 2;
    }

    // Is Sewerage Service
    if (student.informationStudent.isSewerageService?.code === CatalogueYesNoEnum.YES) {
      score += 2;
    }

    // Economic Contribution
    if (student.informationStudent.economicContribution?.code === CatalogueEconomicContributionEnum.PARENTS) {
      score += 6;
    }

    if (student.informationStudent.economicContribution?.code === CatalogueEconomicContributionEnum.GRAND_PARENTS) {
      score += 6;
    }

    if (student.informationStudent.economicContribution?.code === CatalogueEconomicContributionEnum.FAMILY) {
      score += 6;
    }

    // Is Family Economic Aid
    if (student.informationStudent.isFamilyEconomicAid?.code === CatalogueYesNoEnum.NO) {
      score += 2;
    }

    // Is Family Emigrant
    if (student.informationStudent.isFamilyEmigrant?.code === CatalogueYesNoEnum.NO) {
      score += 1;
    }

    return score;
  }

  calculateSocioeconomicFormCategory(score: number): string {
    if (score >= 0 && score <= 25) {
      return 'D';
    }

    if (score >= 25.05 && score <= 50.05) {
      return 'C';
    }

    if (score >= 50.1 && score <= 75.1) {
      return 'B';
    }

    if (score >= 75.15 && score <= 100) {
      return 'A';
    }

    return 'Sin Categoria';
  }

  calculateSocioeconomicFormPercentage(category: string): number {
    switch (category) {
      case 'A':
        return 40;
      case 'B':
        return 30;
      case 'C':
        return 20;
      case 'D':
        return 10;
    }
  }

  private async updateUser(id: string, payload: UpdateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.preload({ id, ...payload });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado para actualizar');
    }

    this.userRepository.merge(user, payload);

    return await this.userRepository.save(user);
  }
}

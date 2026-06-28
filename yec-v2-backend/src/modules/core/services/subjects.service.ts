import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, FindOptionsWhere, ILike, LessThan } from 'typeorm';
import { CreateSubjectDto, FilterSubjectDto, PaginationDto, SeedSubjectDto, UpdateSubjectDto } from '@core/dto';
import { SubjectEntity } from '@core/entities';
import { CareersService, SubjectPrerequisitesService } from '@core/services';
import { CoreRepositoryEnum, MessageEnum } from '@shared/enums';
import { ServiceResponseHttpModel } from '@shared/models';
import { SubjectCorequisitesService } from './subject-corequisites.service';

@Injectable()
export class SubjectsService {
  constructor(
    @Inject(CoreRepositoryEnum.SUBJECT_REPOSITORY)
    private repository: Repository<SubjectEntity>,
    private careersService: CareersService,
    private subjectPrerequisitesService: SubjectPrerequisitesService,
    private subjectCorequisitesService: SubjectCorequisitesService,
  ) {
  }

  async create(payload: CreateSubjectDto): Promise<SubjectEntity> {
    const newSubject = this.repository.create(payload);
    const subject = await this.repository.save(newSubject);

    for (const item of subject.subjectCorequisites) {
      this.subjectCorequisitesService.create(subject.id, item);
    }

    for (const item of subject.subjectPrerequisites) {
      this.subjectPrerequisitesService.create(subject.id, item);
    }

    return subject;
  }

  async findAll(params?: FilterSubjectDto): Promise<ServiceResponseHttpModel> {
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params);
    }

    //Other filters
    if (params?.autonomousHour) {
      return this.filterByAutonomousHour(params.autonomousHour);
    }

    //All
    const data = await this.repository.findAndCount({
      relations: {
        academicPeriod: true,
        curriculum: true,
        state: true,
        type: true,
      },
    });

    return { data: data[0], pagination: { totalItems: data[1], limit: 10 } };
  }

  async findOne(id: string): Promise<SubjectEntity> {
    const subject = await this.repository.findOne({
      relations: {
        academicPeriod: true,
        state: true,
        type: true,
        subjectPrerequisites: { requirement: true },
        subjectCorequisites: { requirement: true },
      },
      where: { id },
    });

    if (!subject) {
      throw new NotFoundException('Asignatura no encontrada');
    }

    return subject;
  }

  async findByCode(code: string): Promise<SubjectEntity> {
    return await this.repository.findOne({ where: { code } });
  }

  async update(id: string, payload: UpdateSubjectDto): Promise<SubjectEntity> {
    const subject = await this.repository.findOneBy({ id });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    await this.subjectPrerequisitesService.removeBySubject(id);
    await this.subjectCorequisitesService.removeBySubject(id);

    for (const item of payload.subjectCorequisites) {
      this.subjectCorequisitesService.create(id, item);
    }

    for (const item of payload.subjectPrerequisites) {
      this.subjectPrerequisitesService.create(id, item);
    }

    this.repository.merge(subject, payload);

    return await this.repository.save(subject);
  }

  async remove(id: string): Promise<SubjectEntity> {
    const subject = await this.repository.findOneBy({ id });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    return await this.repository.save(subject);
  }

  async removeAll(payload: SubjectEntity[]): Promise<SubjectEntity[]> {
    return await this.repository.softRemove(payload);
  }

  private async paginateAndFilter(params: FilterSubjectDto): Promise<ServiceResponseHttpModel> {
    let where: FindOptionsWhere<SubjectEntity> | FindOptionsWhere<SubjectEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({ code: ILike(`%${search}%`) });
      where.push({ name: ILike(`%${search}%`) });
    }

    const response = await this.repository.findAndCount({
      relations: {
        academicPeriod: true,
        curriculum: true,
        state: true,
        type: true,
      },
      where,
      take: limit,
      skip: PaginationDto.getOffset(limit, page),
    });

    return {
      data: response[0],
      pagination: { limit, totalItems: response[1] },
    };
  }

  private async filterByAutonomousHour(autonomousHour: number): Promise<ServiceResponseHttpModel> {
    const where: FindOptionsWhere<SubjectEntity> = {};

    if (autonomousHour) {
      where.autonomousHour = LessThan(autonomousHour);
    }

    const response = await this.repository.findAndCount({
      relations: {
        academicPeriod: true,
        curriculum: true,
        state: true,
        type: true,
      },
      where,
    });

    return {
      data: response[0],
      pagination: { limit: 10, totalItems: response[1] },
    };
  }

  async hide(id: string): Promise<SubjectEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(MessageEnum.NOT_FOUND);
    }
    entity.isVisible = false;
    return await this.repository.save(entity);
  }

  async reactivate(id: string): Promise<SubjectEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(MessageEnum.NOT_FOUND);
    }
    entity.isVisible = true;
    return await this.repository.save(entity);
  }

  async findSubjectsByCurriculum(curriculumId: string): Promise<SubjectEntity[]> {
    const response = await this.repository.find({
      relations: {
        academicPeriod: true,
        type: true,
        subjectCorequisites: { requirement: true },
        subjectPrerequisites: { requirement: true },
      },
      where: {
        curriculumId,
        isVisible: true,
      },
    });

    return response;
  }

  async findSubjectsByCareer(careerId: string): Promise<SubjectEntity[]> {
    const curriculums = await this.careersService.findCurriculumsByCareer(careerId);

    const response = await this.repository.find({
      relations: {
        academicPeriod: true,
        type: true,
        subjectCorequisites: { requirement: true },
        subjectPrerequisites: { requirement: true },
      },
      where: {
        curriculumId: curriculums[0].id,
        isVisible: true,
      },
    });

    return response;
  }

  async findAllSubjectsByCurriculum(curriculumId: string): Promise<SubjectEntity[]> {
    const response = await this.repository.find({
      relations: {
        academicPeriod: true,
        type: true,
        subjectCorequisites: { requirement: true },
        subjectPrerequisites: { requirement: true },
      },
      where: {
        curriculumId,
      },
    });

    return response;
  }

}

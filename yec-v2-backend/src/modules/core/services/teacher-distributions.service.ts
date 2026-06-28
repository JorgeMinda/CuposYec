import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { join } from 'path';
import * as XLSX from 'xlsx';
import {
  CreateTeacherDistributionDto,
  FilterTeacherDistributionDto,
  PaginationDto,
  SeedTeacherDistributionDto,
  UpdateTeacherDistributionDto,
} from '@core/dto';
import { TeacherDistributionEntity } from '@core/entities';
import { CoreRepositoryEnum, MessageEnum } from '@shared/enums';
import { ServiceResponseHttpModel } from '@shared/models';

@Injectable()
export class TeacherDistributionsService {
  constructor(@Inject(CoreRepositoryEnum.TEACHER_DISTRIBUTION_REPOSITORY)
              private repository: Repository<TeacherDistributionEntity>) {
  }

  async catalogue(): Promise<ServiceResponseHttpModel> {
    const response = await this.repository.findAndCount({
      relations: {
        parallel: true,
        teacher: true,
        schoolPeriod: true,
        subject: true,
        workday: true,
      },
      take: 1000,
    });

    return {
      data: response[0],
      pagination: {
        totalItems: response[1],
        limit: 1000,
      },
    };
  }

  async create(payload: CreateTeacherDistributionDto | SeedTeacherDistributionDto): Promise<TeacherDistributionEntity> {
    const newEntity: TeacherDistributionEntity = this.repository.create(payload);
    return await this.repository.save(newEntity);
  }

  async findAll(params?: FilterTeacherDistributionDto): Promise<ServiceResponseHttpModel> {
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params);
    }

    //Filter by other field
    //All
    const data = await this.repository.findAndCount({
      relations: {
        parallel: true,
        teacher: true,
        schoolPeriod: true,
        subject: true,
        workday: true,
      },
    });

    return { pagination: { totalItems: data[1], limit: 10 }, data: data[0] };
  }

  async findOne(id: string): Promise<TeacherDistributionEntity> {
    const entity = await this.repository.findOne({
      relations: {
        parallel: true,
        teacher: { user: true },
        schoolPeriod: true,
        subject: true,
        workday: true,
      },
      where: {
        id,
      },
    });

    if (!entity) {
      throw new NotFoundException(`La carrera con id:  ${id} no se encontró`);
    }

    return entity;
  }

  async update(id: string, payload: UpdateTeacherDistributionDto): Promise<TeacherDistributionEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(MessageEnum.NOT_FOUND);
    }

    this.repository.merge(entity, payload);

    return await this.repository.save(entity);
  }

  async remove(id: string): Promise<TeacherDistributionEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`La carrera con id:  ${id} no se encontro`);
    }

    return await this.repository.softRemove(entity);
  }

  async removeAll(payload: TeacherDistributionEntity[]): Promise<TeacherDistributionEntity[]> {
    return await this.repository.softRemove(payload);
  }

  private async paginateAndFilter(params: FilterTeacherDistributionDto): Promise<ServiceResponseHttpModel> {
    let where: FindOptionsWhere<TeacherDistributionEntity> | FindOptionsWhere<TeacherDistributionEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      //where.push({ acronym: ILike(`%${search}%`) });
    }

    const response = await this.repository.findAndCount({
      relations: {
        parallel: true,
        teacher: true,
        schoolPeriod: true,
        subject: true,
        workday: true,
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

  async exportTeacherDistributions(): Promise<string> {
    let teacherDistributions = (await this.findAll()).data;
    const newWorkbook = XLSX.utils.book_new();
    teacherDistributions = teacherDistributions.map(teacherDistributions => {
      return {
        'codigo asignatura': teacherDistributions.subject.code,
        'nombre asignatura': teacherDistributions.subject.name,
        'nombre docente': teacherDistributions.teacher.user.name,
        'cedula docente': teacherDistributions.teacher.user.identification,
        'paralelo': teacherDistributions.parallel.name,
        'jornada': teacherDistributions.workday.name,
        'horario-semana': teacherDistributions.hours,
      };
    });

    const newSheet = XLSX.utils.json_to_sheet(teacherDistributions);

    XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Distributivo docente');
    const path = join(process.cwd(), 'src/resources/exports', Date.now() + '.xlsx'); //review path
    XLSX.writeFile(newWorkbook, path);
    return path;
  }

  async findCapacity(parallelId: string, schoolPeriodId: string, workdayId: string): Promise<number> {
    const teacherDistribution = await this.repository.findOne({
      where: {
        workdayId,
        parallelId,
        schoolPeriodId,
      },
    });

    return teacherDistribution.capacity;
  }

  async findTeacherDistributionsByTeacher(teacherId: string, schoolPeriodId: string): Promise<TeacherDistributionEntity[]> {
    return await this.repository.find({
      relations: {
        parallel: true,
        teacher: { user: true },
        schoolPeriod: true,
        subject: { curriculum: { career: true }, academicPeriod: true },
        workday: true,
        partialPermissions: { partial: true },
      },
      where: {
        teacherId,
        schoolPeriodId,
      },
      order: { partialPermissions: { partial: { code: 'asc' } } },
    });
  }

  async findTeacherDistributionsByCareer(careerId: string, teacherDistributionId: string): Promise<TeacherDistributionEntity[]> {
    return await this.repository.find({
      relations: {
        parallel: true,
        teacher: true,
        schoolPeriod: true,
        subject: { curriculum: { career: true }, academicPeriod: true },
        workday: true,
        partialPermissions: { partial: true },
      },
      where: {
        id: teacherDistributionId,
        subject: { curriculum: { careerId } },
      },
    });
  }
}

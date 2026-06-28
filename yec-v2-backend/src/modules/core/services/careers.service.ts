import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import {
  CreateCareerDto,
  FilterCareerDto,
  FilterEnrollmentDto,
  PaginationDto,
  SeedCareerDto,
  UpdateCareerDto,
} from '@core/dto';
import { CareerEntity, CareerToTeacherEntity, CatalogueEntity, CurriculumEntity, TeacherEntity } from '@core/entities';
import { AuthRepositoryEnum, CoreRepositoryEnum, MessageEnum } from '@shared/enums';
import { ServiceResponseHttpModel } from '@shared/models';
import { UserEntity } from '@auth/entities';

@Injectable()
export class CareersService {
  constructor(
    @Inject(CoreRepositoryEnum.CAREER_REPOSITORY) private repository: Repository<CareerEntity>,
    @Inject(AuthRepositoryEnum.USER_REPOSITORY) private userRepository: Repository<UserEntity>,
  ) {
  }

  async catalogue(): Promise<ServiceResponseHttpModel> {
    const response = await this.repository.findAndCount({
      relations: { institution: true, modality: true, state: true, type: true },
      take: 1000,
    });

    return {
      pagination: {
        totalItems: response[1],
        limit: 1000,
      },
      data: response[0],
    };
  }

  async create(payload: CreateCareerDto): Promise<CareerEntity> {
    const newEntity: CareerEntity = this.repository.create(payload);
    const user = this.userRepository.create({ id: payload.userId });
    newEntity.users = [user];

    return await this.repository.save(newEntity);
  }

  async findAll(): Promise<ServiceResponseHttpModel> {
    //All
    const data = await this.repository.findAndCount({
      relations: ['institution', 'modality', 'state', 'type'],
    });

    return { pagination: { totalItems: data[1], limit: 10 }, data: data[0] };
  }

  async findCareersByInstitution(institutionId: string, params?: FilterCareerDto): Promise<ServiceResponseHttpModel> {
    const relations = { modality: true, state: true, type: true };
    //Pagination & Filter by Search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(institutionId, params, relations);
    }

    //All
    const data = await this.repository.findAndCount({
      where: { institution: { id: institutionId } },
      relations,
    });

    return { pagination: { totalItems: data[1], limit: 10 }, data: data[0] };
  }

  async findOne(id: string): Promise<CareerEntity> {
    const entity = await this.repository.findOne({
      relations: ['institution', 'modality', 'state', 'type'],
      where: {
        id,
      },
    });

    if (!entity) {
      throw new NotFoundException(`La carrera con id:  ${id} no se encontró`);
    }

    return entity;
  }

  async findByCode(code: string): Promise<CareerEntity> {
    const entity = await this.repository.findOne(
      {
        relations: { curriculums: true },
        where: { code },
      });

    if (!entity) {
      throw new NotFoundException(`La carrera no se encontró`);
    }

    return entity;
  }

  async update(id: string, payload: UpdateCareerDto): Promise<CareerEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(MessageEnum.NOT_FOUND);
    }

    this.repository.merge(entity, payload);

    return await this.repository.save(entity);
  }

  async remove(id: string): Promise<CareerEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`La carrera con id:  ${id} no se encontro`);
    }

    return await this.repository.softRemove(entity);
  }

  async removeAll(payload: CareerEntity[]): Promise<CareerEntity[]> {
    return await this.repository.softRemove(payload);
  }

  private async paginateAndFilter(institutionId: string, params: FilterCareerDto, relations: any): Promise<ServiceResponseHttpModel> {
    let where: FindOptionsWhere<CareerEntity> | FindOptionsWhere<CareerEntity>[];
    where = { institution: { id: institutionId } };
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({ institution: { id: institutionId }, acronym: ILike(`%${search}%`) });
      where.push({ institution: { id: institutionId }, code: ILike(`%${search}%`) });
      where.push({ institution: { id: institutionId }, codeSniese: ILike(`%${search}%`) });
      where.push({ institution: { id: institutionId }, logo: ILike(`%${search}%`) });
      where.push({ institution: { id: institutionId }, name: ILike(`%${search}%`) });
      where.push({ institution: { id: institutionId }, shortName: ILike(`%${search}%`) });
      where.push({ institution: { id: institutionId }, degree: ILike(`%${search}%`) });
    }

    const response = await this.repository.findAndCount({
      relations,
      where,
      take: limit,
      skip: PaginationDto.getOffset(limit, page),
    });

    return {
      data: response[0],
      pagination: { limit, totalItems: response[1] },
    };
  }

  async hide(id: string): Promise<CareerEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(MessageEnum.NOT_FOUND);
    }
    entity.isVisible = false;
    return await this.repository.save(entity);
  }

  async reactivate(id: string): Promise<CareerEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(MessageEnum.NOT_FOUND);
    }
    entity.isVisible = true;
    return await this.repository.save(entity);
  }

  async findTeachersByCareer(id: string): Promise<CareerToTeacherEntity[]> {
    const entity = await this.repository.findOne({
      relations: { careerToTeachers: { teacher: { user: true } } },
      where: {
        id,
      },
    });

    if (!entity) {
      throw new NotFoundException(`La carrera con id:  ${id} no se encontró`);
    }

    return entity.careerToTeachers;
  }

  async findCurriculumsByCareer(id: string): Promise<CurriculumEntity[]> {
    const entity = await this.repository.findOne({
      relations: { curriculums: true },
      where: {
        id,
      },
    });

    if (!entity) {
      throw new NotFoundException(`La carrera con id:  ${id} no se encontró`);
    }

    return entity.curriculums;
  }

  async findCareersByAuthenticatedUser(user: UserEntity): Promise<CareerEntity[]> {
    return await this.repository.find({
      relations: { state: true, curriculums: true },
      where: { users: { id: user.id } },
    });
  }
}

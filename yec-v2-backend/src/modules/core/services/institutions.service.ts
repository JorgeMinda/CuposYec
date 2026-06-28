import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { UserEntity } from '@auth/entities';
import {
  CreateInstitutionDto,
  FilterInstitutionDto,
  PaginationDto,
  SeedInstitutionDto,
  UpdateInstitutionDto,
} from '@core/dto';
import { InstitutionEntity } from '@core/entities';
import { ServiceResponseHttpModel } from '@shared/models';
import { CoreRepositoryEnum, MessageEnum } from '@shared/enums';
import { PartialsService } from './partials.service';

@Injectable()
export class InstitutionsService {
  constructor(@Inject(CoreRepositoryEnum.INSTITUTION_REPOSITORY) private repository: Repository<InstitutionEntity>,
              private partialsService: PartialsService) {
  }

  async create(payload: CreateInstitutionDto | SeedInstitutionDto): Promise<InstitutionEntity> {
    const newInstitution = this.repository.create(payload);

    return await this.repository.save(newInstitution);
  }

  async findAll(params?: FilterInstitutionDto): Promise<ServiceResponseHttpModel> {
    const relations = { address: true, state: true };
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params, relations);
    }

    //Other filters
    // if (params.numberStudents) {
    //   return await this.filterByNumberStudents(params.numberStudents);
    // }

    //All
    const response = await this.repository.find({ relations });
    return { data: response, pagination: { totalItems: response.length, limit: response.length } };
  }

  async findOne(id: string): Promise<InstitutionEntity> {
    const institution = await this.repository.findOne({
      relations: ['address', 'state'],
      where: { id },
    });
    if (!institution) throw new NotFoundException('Institution not found');

    return institution;
  }

  async findByCode(code: string): Promise<InstitutionEntity> {
    const institution = await this.repository.findOne({
      relations: { careers: true },
      where: { code },
    });

    if (!institution) throw new NotFoundException('Institución no encontrada');

    return institution;
  }

  async findInstitutionsByAuthenticatedUser(user: UserEntity, params?: FilterInstitutionDto): Promise<ServiceResponseHttpModel> {
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilterByAuthenticatedUser(user, params);
    }

    const data = await this.repository.findAndCount({
      relations: { state: true },
      where: { users: { id: user.id } },
    });

    return { data: data[0], pagination: { totalItems: data[1], limit: 10 } };
  }

  async update(id: string, payload: UpdateInstitutionDto): Promise<InstitutionEntity> {
    const institution = await this.repository.findOneBy({ id });

    if (!institution) throw new NotFoundException('Institution not found');

    this.repository.merge(institution, payload);

    return await this.repository.save(institution);
  }

  async remove(id: string): Promise<InstitutionEntity> {
    const institution = await this.repository.findOneBy({ id });

    if (!institution) throw new NotFoundException('Institution not found');

    return await this.repository.softRemove(institution);
  }

  async enable(id: string): Promise<InstitutionEntity> {
    const institution = await this.repository.findOneBy({ id });

    if (!institution) throw new NotFoundException('Institution not found');

    // institution.state = this.cataloguesService.findByType(CatalogueTypeEnum.INSTITUTIONS_STATE);

    return await this.repository.save(institution);
  }

  async removeAll(payload: InstitutionEntity[]): Promise<InstitutionEntity[]> {
    return await this.repository.softRemove(payload);
  }

  async hide(id: string): Promise<InstitutionEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(MessageEnum.NOT_FOUND);
    }
    entity.isVisible = false;
    return await this.repository.save(entity);
  }

  async reactivate(id: string): Promise<InstitutionEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(MessageEnum.NOT_FOUND);
    }
    entity.isVisible = true;
    return await this.repository.save(entity);
  }

  private async paginateAndFilter(params: FilterInstitutionDto, relations: any): Promise<ServiceResponseHttpModel> {
    let where: FindOptionsWhere<InstitutionEntity> | FindOptionsWhere<InstitutionEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({ acronym: ILike(`%${search}`) });
      where.push({ code: ILike(`%${search}`) });
      where.push({ codeSniese: ILike(`%${search}`) });
      where.push({ denomination: ILike(`%${search}`) });
      where.push({ email: ILike(`%${search}`) });
      where.push({ name: ILike(`%${search}`) });
      where.push({ shortName: ILike(`%${search}`) });
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

  private async paginateAndFilterByAuthenticatedUser(user: UserEntity, params: FilterInstitutionDto): Promise<ServiceResponseHttpModel> {
    let where: FindOptionsWhere<InstitutionEntity> | FindOptionsWhere<InstitutionEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({ users: { id: user.id }, acronym: ILike(`%${search}`) });
      where.push({ users: { id: user.id }, code: ILike(`%${search}`) });
      where.push({ users: { id: user.id }, codeSniese: ILike(`%${search}`) });
      where.push({ users: { id: user.id }, denomination: ILike(`%${search}`) });
      where.push({ users: { id: user.id }, email: ILike(`%${search}`) });
      where.push({ users: { id: user.id }, name: ILike(`%${search}`) });
      where.push({ users: { id: user.id }, shortName: ILike(`%${search}`) });
    }

    const response = await this.repository.findAndCount({
      relations: { state: true },
      where,
      take: limit,
      skip: PaginationDto.getOffset(limit, page),
    });

    return {
      data: response[0],
      pagination: { limit, totalItems: response[1] },
    };
  }

  private async paginateCareersAndFilter(params: FilterInstitutionDto): Promise<ServiceResponseHttpModel> {
    let where: FindOptionsWhere<InstitutionEntity> | FindOptionsWhere<InstitutionEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({ acronym: ILike(`%${search}`) });
      where.push({ code: ILike(`%${search}`) });
      where.push({ codeSniese: ILike(`%${search}`) });
      where.push({ denomination: ILike(`%${search}`) });
      where.push({ email: ILike(`%${search}`) });
      where.push({ name: ILike(`%${search}`) });
      where.push({ shortName: ILike(`%${search}`) });
    }

    const response = await this.repository.findAndCount({
      relations: ['address', 'state'],
      where,
      take: limit,
      skip: PaginationDto.getOffset(limit, page),
    });

    return {
      data: response[0],
      pagination: { limit, totalItems: response[1] },
    };
  }

  async findByUser(userId: string, params?: FilterInstitutionDto): Promise<ServiceResponseHttpModel> {
    const relations = { address: true, state: true };
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params, relations);
    }

    //All
    const data = await this.repository.findAndCount({
      relations: ['address', 'state'],
    });
    return { data: data[0], pagination: { totalItems: data[1], limit: 10 } };
  }
}

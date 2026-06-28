import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Equal, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CreateEventDto, FilterEventDto, PaginationDto, UpdateEventDto } from '@core/dto';

import { CataloguesService, SchoolPeriodsService } from '@core/services';
import { ServiceResponseHttpModel } from '@shared/models';
import { CoreRepositoryEnum, MessageEnum } from '@shared/enums';
import { EventEntity, SchoolPeriodEntity } from '@core/entities';

@Injectable()
export class EventsService {
  constructor(
    @Inject(CoreRepositoryEnum.EVENT_REPOSITORY)
    private repository: Repository<EventEntity>,
    private cataloguesService: CataloguesService,
   // private schoolPeriodsService: SchoolPeriodsService,
  ) {}

  async catalogue(): Promise<ServiceResponseHttpModel> {
    const response = await this.repository.findAndCount({
      relations: ['name', 'state'],
      take: 1000,
    });

    return {
      data: response[0],
      pagination: {
        totalItems: response[1],
        limit: 10,
      },
    };
  }

  async create(modelId: string, payload: CreateEventDto): Promise<EventEntity> {
    const newEntity = this.repository.create(payload);
    // newEntity.schoolPeriod = await this.schoolPeriodsService.actualSchoolPeriod();
    // newEntity.modelId = modelId;

    return await this.repository.save(newEntity);
  }

  async findAll(params?: FilterEventDto): Promise<ServiceResponseHttpModel> {
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params);
    }

    //Filter by other field

    //All
    const data = await this.repository.findAndCount({
      relations: ['name', 'state'],
    });

    return { pagination: { totalItems: data[1], limit: 10 }, data: data[0] };
  }

  async findByModel(modelId: string, params?: FilterEventDto): Promise<ServiceResponseHttpModel> {
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilterByModel(modelId, params);
    }

    //Filter by other field

    //All
    const data = await this.repository.findAndCount({
      where: { modelId },
      relations: ['name', 'state'],
    });

    return { pagination: { totalItems: data[1], limit: 10 }, data: data[0] };
  }

  async findOne(id: string): Promise<EventEntity> {
    const entity = await this.repository.findOne({
      relations: ['name', 'state'],
      where: {
        id,
      },
    });

    if (!entity) {
      throw new NotFoundException(MessageEnum.NOT_FOUND);
    }

    return entity;
  }

  async update(id: string, payload: UpdateEventDto): Promise<EventEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(MessageEnum.NOT_FOUND);
    }

    this.repository.merge(entity, payload);

    return await this.repository.save(entity);
  }

  async remove(id: string): Promise<EventEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(MessageEnum.NOT_FOUND);
    }

    return await this.repository.softRemove(entity);
  }

  async removeAll(payload: EventEntity[]): Promise<EventEntity[]> {
    return await this.repository.softRemove(payload);
  }

  private async paginateAndFilter(params: FilterEventDto): Promise<ServiceResponseHttpModel> {
    let where: FindOptionsWhere<EventEntity> | FindOptionsWhere<EventEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({ description: ILike(`%${search}%`) });
    }

    const response = await this.repository.findAndCount({
      relations: ['name', 'state'],
      where,
      take: limit,
      skip: PaginationDto.getOffset(limit, page),
    });

    return {
      data: response[0],
      pagination: { limit, totalItems: response[1] },
    };
  }

  private async paginateAndFilterByModel(modelId: string, params: FilterEventDto): Promise<ServiceResponseHttpModel> {
    let where: FindOptionsWhere<EventEntity> | FindOptionsWhere<EventEntity>[];

    let { page, search } = params;
    const { limit } = params;

    where = [];

    where.push({ modelId: Equal(modelId) });
    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({
        description: ILike(`%${search}%`),
        modelId: Equal(modelId),
      });
    }

    const response = await this.repository.findAndCount({
      relations: ['name', 'state'],
      where,
      take: limit,
      skip: PaginationDto.getOffset(limit, page),
    });

    return {
      data: response[0],
      pagination: { limit, totalItems: response[1] },
    };
  }

  async hide(id: string): Promise<EventEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(MessageEnum.NOT_FOUND);
    }
    entity.enabled = false;
    return await this.repository.save(entity);
  }

  async reactivate(id: string): Promise<EventEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(MessageEnum.NOT_FOUND);
    }
    entity.enabled = true;
    return await this.repository.save(entity);
  }
}

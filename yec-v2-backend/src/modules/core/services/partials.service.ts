import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CreatePartialDto, FilterPartialDto, PaginationDto, SeedPartialDto, UpdatePartialDto } from '@core/dto';
import { PartialEntity } from '@core/entities';
import { CataloguesService } from '@core/services';
import { ServiceResponseHttpModel } from '@shared/models';
import { CoreRepositoryEnum, MessageEnum } from '@shared/enums';

@Injectable()
export class PartialsService {
  constructor(
    @Inject(CoreRepositoryEnum.PARTIAL_REPOSITORY)
    private repository: Repository<PartialEntity>,
    private cataloguesService: CataloguesService,
  ) {}

  async catalogue(): Promise<ServiceResponseHttpModel> {
    const response = await this.repository.findAndCount({
      relations: ['institution', 'modality', 'state', 'type'],
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

  async create(payload: CreatePartialDto | SeedPartialDto): Promise<PartialEntity> {
    const newEntity: PartialEntity = this.repository.create(payload);
    return await this.repository.save(newEntity);
  }

  async findAll(params?: FilterPartialDto): Promise<ServiceResponseHttpModel> {
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params);
    }

    //Filter by other field
    //All
    const data = await this.repository.findAndCount();

    return { pagination: { totalItems: data[1], limit: 10 }, data: data[0] };
  }

  async findOne(id: string): Promise<PartialEntity> {
    const entity = await this.repository.findOne({
      relations: ['institution', 'modality', 'state', 'type'],
      where: {
        id,
      },
    });

    if (!entity) {
      throw new NotFoundException(`El parcial con id:  ${id} no se encontró`);
    }

    return entity;
  }

  async update(id: string, payload: UpdatePartialDto): Promise<PartialEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(MessageEnum.NOT_FOUND);
    }

    this.repository.merge(entity, payload);

    return await this.repository.save(entity);
  }

  async remove(id: string): Promise<PartialEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`El Parcial con id:  ${id} no se encontro`);
    }

    return await this.repository.softRemove(entity);
  }

  async removeAll(payload: PartialEntity[]): Promise<PartialEntity[]> {
    return await this.repository.softRemove(payload);
  }

  private async paginateAndFilter(params: FilterPartialDto): Promise<ServiceResponseHttpModel> {
    let where: FindOptionsWhere<PartialEntity> | FindOptionsWhere<PartialEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({ name: ILike(`%${search}%`) });
    }

    const response = await this.repository.findAndCount({
      relations: ['institution', 'modality', 'state', 'type'],
      where,
      take: limit,
      skip: PaginationDto.getOffset(limit, page),
    });

    return {
      data: response[0],
      pagination: { limit, totalItems: response[1] },
    };
  }

  /* async hide(id: string): Promise<PartialEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(MessageEnum.NOT_FOUND);
    }
    entity.isVisible = false;
    return await this.repository.save(entity);
  }

  async reactivate(id: string): Promise<PartialEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(MessageEnum.NOT_FOUND);
    }
    entity.isVisible = true;
    return await this.repository.save(entity);
  }*/
}

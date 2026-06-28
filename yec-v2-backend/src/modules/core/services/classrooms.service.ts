import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CreateClassroomDto, UpdateClassroomDto, PaginationDto, SeedClassroomDto, FilterClassroomDto } from '@core/dto';
import { ClassroomEntity } from '@core/entities';
import { CataloguesService } from '@core/services';
import { ServiceResponseHttpModel } from '@shared/models';
import { CoreRepositoryEnum } from '@shared/enums';

@Injectable()
export class ClassroomsService {
  constructor(
    @Inject(CoreRepositoryEnum.CLASSROOM_REPOSITORY)
    private repository: Repository<ClassroomEntity>,
    private cataloguesService: CataloguesService,
  ) {}

  async create(payload: CreateClassroomDto | SeedClassroomDto): Promise<ClassroomEntity> {
    const newClassroom = this.repository.create(payload);

    return await this.repository.save(newClassroom);
  }

  async findAll(params?: FilterClassroomDto): Promise<ServiceResponseHttpModel> {
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params);
    }

    //All
    const data = await this.repository.findAndCount({
      relations: ['enrollmentDetail'],
    });
    return { data: data[0], pagination: { totalItems: data[1], limit: 10 } };
  }

  async findOne(id: string): Promise<ClassroomEntity> {
    const classroom = await this.repository.findOne({
      relations: ['enrollmentDetail'],
      where: { id },
    });
    if (!classroom) throw new NotFoundException('Classroom not found');

    return classroom;
  }

  async update(id: string, payload: UpdateClassroomDto): Promise<ClassroomEntity> {
    const classroom = await this.repository.findOneBy({ id });

    if (!classroom) throw new NotFoundException('Classroom not found');

    this.repository.merge(classroom, payload);

    return await this.repository.save(classroom);
  }

  async remove(id: string): Promise<ClassroomEntity> {
    const classroom = await this.repository.findOneBy({ id });

    if (!classroom) throw new NotFoundException('Clasroom not found');

    return await this.repository.softRemove(classroom);
  }

  async removeAll(payload: ClassroomEntity[]): Promise<ClassroomEntity[]> {
    return await this.repository.softRemove(payload);
  }

  private async paginateAndFilter(params: FilterClassroomDto): Promise<ServiceResponseHttpModel> {
    let where: FindOptionsWhere<ClassroomEntity> | FindOptionsWhere<ClassroomEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({ name: ILike(`%${search}`) });
    }

    const response = await this.repository.findAndCount({
      relations: ['enrollmentDetail'],
      where,
      take: limit,
      skip: PaginationDto.getOffset(limit, page),
    });

    return {
      data: response[0],
      pagination: { limit, totalItems: response[1] },
    };
  }
  async findAllSimple(): Promise<ClassroomEntity[]> {
    return await this.repository.find();
}
}

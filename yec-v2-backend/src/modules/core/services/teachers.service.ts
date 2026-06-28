import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, FindOptionsWhere } from 'typeorm';
import { FilterTeacherDto, PaginationDto, UpdateTeacherDto } from '@core/dto';
import { TeacherEntity } from '@core/entities';
import { InformationTeachersService } from '@core/services';
import { AuthRepositoryEnum, CoreRepositoryEnum, MessageEnum } from '@shared/enums';
import { ServiceResponseHttpModel } from '@shared/models';
import { UpdateUserDto } from '@auth/dto';
import { UserEntity } from '@auth/entities';

@Injectable()
export class TeachersService {
  constructor(
    @Inject(CoreRepositoryEnum.TEACHER_REPOSITORY) private repository: Repository<TeacherEntity>,
    @Inject(AuthRepositoryEnum.USER_REPOSITORY) private readonly userRepository: Repository<UserEntity>,
    private informationTeachersService: InformationTeachersService,
  ) {
  }

  async catalogue() {
    const data = await this.repository.findAndCount({
      take: 1000,
    });

    return { pagination: { totalItems: data[1], limit: 10 }, data: data[0] };
  }

  async findAll(): Promise<TeacherEntity[]> {
    return await this.repository.find({
      relations: { user: true, informationTeacher: true },
    });
  }

  async findTeachers(params?: FilterTeacherDto): Promise<ServiceResponseHttpModel> {
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params);
    }

    return { pagination: { totalItems: 0, limit: 10 }, data: [] };
  }

  async findOne(id: string) {
    const teacher = await this.repository.findOne({
      relations: { informationTeacher: true, user: true },
      where: { id },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return teacher;
  }

  async update(id: string, payload: UpdateTeacherDto): Promise<TeacherEntity> {
    const teacher = await this.repository.findOneBy({ id });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    this.repository.merge(teacher, payload);

    await this.repository.save(teacher);

    await this.updateUser(payload.user.id, payload.user);

    payload.informationTeacher.teacher = await this.repository.save(teacher);

    if (payload.informationTeacher?.id) {
      await this.informationTeachersService.update(payload.informationTeacher.id, payload.informationTeacher);
    } else {
      const { id, ...informationTeacherRest } = payload.informationTeacher;
      await this.informationTeachersService.create(informationTeacherRest);
    }

    return teacher;
  }

  async updateCareers(id: string, payload: UpdateTeacherDto): Promise<TeacherEntity> {
    let teacher = await this.repository.findOneBy({ id });

    if(!id){
      teacher = this.repository.create();
    }

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

  //  this.repository.merge(teacher, payload);
    teacher.userId = payload.userId;
   // teacher.careers = payload.careers;
    console.log(teacher);
    await this.repository.save(teacher);

    return teacher;
  }

  async remove(id: string) {
    const teacher = await this.repository.findOneBy({ id });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return await this.repository.softRemove(teacher);
  }

  async removeAll(payload: TeacherEntity[]) {
    return this.repository.softRemove(payload);
  }

  private async paginateAndFilter(params: FilterTeacherDto) {
    let where: FindOptionsWhere<TeacherEntity> | FindOptionsWhere<TeacherEntity>[];
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
      relations: { user: true, informationTeacher: true, careerToTeachers: true },
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

  async hide(id: string): Promise<TeacherEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(MessageEnum.NOT_FOUND);
    }
    entity.isVisible = false;
    return await this.repository.save(entity);
  }

  async reactivate(id: string): Promise<TeacherEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(MessageEnum.NOT_FOUND);
    }
    entity.isVisible = true;
    return await this.repository.save(entity);
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

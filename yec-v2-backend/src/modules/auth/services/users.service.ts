import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { FindOptionsWhere, ILike, LessThan, Repository } from 'typeorm';
import { CreateUserDto, FilterUserDto, ReadUserDto, SeedUserDto, UpdateUserDto } from '@auth/dto';
import { MAX_ATTEMPTS } from '@auth/constants';
import { UserEntity } from '@auth/entities';
import { PaginationDto } from '@core/dto';
import { ServiceResponseHttpModel } from '@shared/models';
import { AuthRepositoryEnum } from '@shared/enums';
import { CareerEntity } from '@core/entities';
import { RoleEnum } from '@auth/enums';
import { TeachersService } from '../../core/services/teachers.service';
import { StudentsService } from '../../core/services/students.service';
import { InformationStudentsService } from '@core/services';

@Injectable()
export class UsersService {
  constructor(
    @Inject(AuthRepositoryEnum.USER_REPOSITORY) private repository: Repository<UserEntity>,
    private readonly teachersService: TeachersService,
    private readonly studentsService: StudentsService,
    private readonly informationStudentsService: InformationStudentsService,
  ) {
  }

  async create(payload: CreateUserDto): Promise<UserEntity> {
    const newUser = this.repository.create(payload);
    newUser.institutions = [payload.institution];
    newUser.careers = payload.careers;

    const userCreated = await this.repository.save(newUser);

    if (payload.roles.find(role => role.code === RoleEnum.TEACHER)) {
      await this.teachersService.create({ userId: userCreated.id, careers: payload.careers });
    }

    if (payload.roles.find(role => role.code === RoleEnum.STUDENT)) {
      const studentCreated = await this.studentsService.create({ userId: userCreated.id, careers: payload.careers });
      await this.informationStudentsService.create({ student: studentCreated });
    }

    return await this.repository.save(newUser);
  }

  async catalogue(): Promise<ServiceResponseHttpModel> {
    const response = await this.repository.findAndCount({ take: 1000 });

    return {
      data: response[0],
      pagination: { totalItems: response[1], limit: 10 },
    };
  }

  async findAll(params?: FilterUserDto): Promise<ServiceResponseHttpModel> {
    const relations = { roles: true, careers: true };
    //Pagination & Filter by Search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params, relations);
    }
    //Other filters
    if (params?.birthdate) {
      return this.filterByBirthdate(params.birthdate);
    }

    //All
    const response = await this.repository.findAndCount({
      relations,
      order: { updatedAt: 'DESC' },
    });

    return {
      data: response[0],
      pagination: { totalItems: response[1], limit: 10 },
    };
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.repository.findOne({
      where: { id },
      relations: { roles: true, identificationType: true, careers: true, institutions: true },
      select: { password: false },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado (find one)');
    }

    return user;
  }

  async findByUsername(username: string): Promise<UserEntity> {
    const user = await this.repository.findOne({
      where: { username },
      select: { password: false },
    });

    if (!user) {
      throw new NotFoundException('Nombre de usuario no existe');
    }

    return user;
  }

  async update(id: string, payload: UpdateUserDto): Promise<UserEntity> {
    const user = await this.repository.findOne({
      relations: { teacher: true, student: true, roles: true },
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado para actualizar');
    }

    if (user.roles.find(role => role.code === RoleEnum.TEACHER)) {
      await this.teachersService.updateCareers(user?.teacher?.id, { careers: payload.careers, userId: id });
    }

    if (user.roles.find(role => role.code === RoleEnum.STUDENT)) {
      await this.studentsService.updateCareers(user.student.id, { careers: payload.careers });
    }

    this.repository.merge(user, payload);

    user.institutions = [payload.institution];
    user.roles = payload.roles;

    return await this.repository.save(user);
  }

  async reactivate(id: string): Promise<ReadUserDto> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado para reactivar');
    }

    user.suspendedAt = null;
    user.maxAttempts = MAX_ATTEMPTS;

    const userUpdated = await this.repository.save(user);

    return plainToInstance(ReadUserDto, userUpdated);
  }

  async remove(id: string): Promise<ReadUserDto> {
    const user = await this.repository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado para eliminar');
    }

    const userDeleted = await this.repository.softRemove(user);

    return plainToInstance(ReadUserDto, userDeleted);
  }

  async removeAll(payload: UserEntity[]): Promise<UserEntity> {
    const usersDeleted = await this.repository.softRemove(payload);
    return usersDeleted[0];
  }

  private async paginateAndFilter(params: FilterUserDto, relations: any): Promise<ServiceResponseHttpModel> {
    let where: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({ identification: ILike(`%${search}%`) });
      where.push({ lastname: ILike(`%${search}%`) });
      where.push({ name: ILike(`%${search}%`) });
      where.push({ username: ILike(`%${search}%`) });
      where.push({ roles: {name:ILike(`%${search}%`)} });
    }

    const response = await this.repository.findAndCount({
      where,
      relations,
      take: limit,
      skip: PaginationDto.getOffset(limit, page),
      order: {
        updatedAt: 'DESC',
      },
    });

    return {
      data: plainToInstance(ReadUserDto, response[0]),
      pagination: { limit, totalItems: response[1] },
    };
  }

  private async filterByBirthdate(birthdate: Date): Promise<ServiceResponseHttpModel> {
    const where: FindOptionsWhere<UserEntity> = {};

    if (birthdate) {
      where.birthdate = LessThan(birthdate);
    }

    const response = await this.repository.findAndCount({ where });

    return {
      data: plainToInstance(ReadUserDto, response[0]),
      pagination: { limit: 10, totalItems: response[1] },
    };
  }

  async suspend(id: string): Promise<ReadUserDto> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado para suspender');
    }

    user.suspendedAt = new Date();

    const userUpdated = await this.repository.save(user);

    return plainToInstance(ReadUserDto, userUpdated);
  }

  async findCareersByUser(id: string): Promise<CareerEntity[]> {
    const user = await this.repository.findOne({
      where: { id },
      relations: { careers: true },
    });

    return user.careers;
  }
}

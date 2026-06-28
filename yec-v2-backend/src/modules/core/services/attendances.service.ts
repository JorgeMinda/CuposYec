import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Repository, FindOptionsWhere} from 'typeorm';
import {CreateAttendanceDto, FilterGradeDto, UpdateGradeDto} from '@core/dto';
import {GradeEntity, AttendanceEntity} from '@core/entities';
import {PaginationDto} from '@core/dto';
import {ServiceResponseHttpModel} from '@shared/models';
import {CoreRepositoryEnum} from '@shared/enums';

@Injectable()
export class AttendancesService {
    constructor(
        @Inject(CoreRepositoryEnum.ATTENDANCE_REPOSITORY)
        private repository: Repository<AttendanceEntity>,
    ) {
    }

    async create(payload: CreateAttendanceDto): Promise<AttendanceEntity> {
        const newEntity = this.repository.create(payload);

        return await this.repository.save(newEntity);
    }

    async findAll(params?: FilterGradeDto): Promise<ServiceResponseHttpModel> {
        //Pagination & Filter by search
        if (params?.limit > 0 && params?.page >= 0) {
            return await this.paginateAndFilter(params);
        }

        //Other filters
        // if (params.value) {
        //   return this.filterByValue(params.value);
        // }

        //All
        const data = await this.repository.findAndCount({
            relations: {enrollmentDetail: true, partial: true},
        });

        return {data: data[0], pagination: {totalItems: data[1], limit: 10}};
    }

    async findOne(id: string): Promise<AttendanceEntity> {
        const subject = await this.repository.findOne({
            relations: {enrollmentDetail: true, partial: true},
            where: {id},
        });

        if (!subject) {
            throw new NotFoundException('Grade not found');
        }

        return subject;
    }

    async update(id: string, payload: UpdateGradeDto): Promise<AttendanceEntity> {
        const subject = await this.repository.findOneBy({id});

        if (!subject) {
            throw new NotFoundException('Grade not found');
        }

        this.repository.merge(subject, payload);

        return await this.repository.save(subject);
    }

    async remove(id: string): Promise<AttendanceEntity> {
        const subject = await this.repository.findOneBy({id});

        if (!subject) {
            throw new NotFoundException('Grade not found');
        }

        return await this.repository.softRemove(subject);
    }

    async removeAll(payload: GradeEntity[]): Promise<GradeEntity[]> {
        return await this.repository.softRemove(payload);
    }

    private async paginateAndFilter(params: FilterGradeDto): Promise<ServiceResponseHttpModel> {
        let where: FindOptionsWhere<GradeEntity> | FindOptionsWhere<GradeEntity>[];
        where = {};
        let {page, search} = params;
        const {limit} = params;

        if (search) {
            search = search.trim();
            page = 0;
            where = [];
            // where.push({ enrollmentDetail: ILike(`%${search}%`) });
        }

        const response = await this.repository.findAndCount({
            relations: {enrollmentDetail: true, partial: true},
            where,
            take: limit,
            skip: PaginationDto.getOffset(limit, page),
        });

        return {
            data: response[0],
            pagination: {limit, totalItems: response[1]},
        };
    }
}

import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Repository, FindOptionsWhere, ILike, LessThan} from 'typeorm';
import {InformationTeacherEntity} from '@core/entities';
import {
    CreateInformationTeacherDto,
    FilterInformationTeacherDto,
    PaginationDto,
    SeederInformationTeacherDto,
    UpdateInformationTeacherDto
} from '@core/dto';
import {ServiceResponseHttpModel} from '@shared/models';
import {CoreRepositoryEnum, MessageEnum} from '@shared/enums';

@Injectable()
export class InformationTeachersService {
    constructor(
        @Inject(CoreRepositoryEnum.INFORMATION_TEACHER_REPOSITORY)
        private repository: Repository<InformationTeacherEntity>,
    ) {
    }

    async create(payload: CreateInformationTeacherDto | SeederInformationTeacherDto): Promise<InformationTeacherEntity> {
        const newInformationTeacher = this.repository.create(payload);

        return await this.repository.save(newInformationTeacher);
    }

    async findAll(params?: FilterInformationTeacherDto): Promise<ServiceResponseHttpModel> {
        //Pagination
        if (params) {
            return await this.paginateAndFilter(params);
        }

        //Other filters
        if (params.holidays) {
            return this.filterByHolidays(params.holidays);
        }
        const data = await this.repository.findAndCount({
            relations: {
                countryHigherEducation: true,
                dedicationTime: true,
                financingType: true,
                higherEducation: true,
                scholarship: true,
                scholarshipType: true,
                teachingLadder: true,
            },
        });
        return {data: data[0], pagination: {totalItems: data[1], limit: 10}};
    }

    async findOne(id: string): Promise<InformationTeacherEntity> {
        const informationTeacher = await this.repository.findOne({
            relations: {
                countryHigherEducation: true,
                dedicationTime: true,
                financingType: true,
                higherEducation: true,
                scholarship: true,
                scholarshipType: true,
                teachingLadder: true,
            },
            where: {id},
        });

        if (!informationTeacher) {
            throw new NotFoundException('No se encontro la información');
        }

        return informationTeacher;
    }

    async update(id: string, payload: UpdateInformationTeacherDto): Promise<InformationTeacherEntity> {
        const informationTeacher = await this.repository.findOneBy({id});
        if (informationTeacher === null) {
            throw new NotFoundException('La informacion del docente no se encontro');
        }

        this.repository.merge(informationTeacher, payload);

        return await this.repository.save(informationTeacher);
    }

    async remove(id: string): Promise<InformationTeacherEntity> {
        const informationTeacher = await this.repository.findOneBy({id});

        if (!informationTeacher) {
            throw new NotFoundException('Informacion del docente no encontrada');
        }

        return await this.repository.save(informationTeacher);
    }

    async removeAll(payload: InformationTeacherEntity[]): Promise<InformationTeacherEntity[]> {
        return await this.repository.softRemove(payload);
    }

    private async paginateAndFilter(params: FilterInformationTeacherDto): Promise<ServiceResponseHttpModel> {
        let where: FindOptionsWhere<InformationTeacherEntity> | FindOptionsWhere<InformationTeacherEntity>[];
        where = {};
        let {page, search} = params;
        const {limit} = params;

        if (search) {
            search = search.trim();
            page = 0;
            where = [];
            where.push({academicUnit: ILike(`%${search}%`)});
            where.push({degreeHigherEducation: ILike(`%${search}%`)});
            where.push({institutionHigherEducation: ILike(`%${search}%`)});
            where.push({technical: ILike(`%${search}%`)});
            where.push({technology: ILike(`%${search}%`)});
        }

        const response = await this.repository.findAndCount({
            relations: {
                countryHigherEducation: true,
                dedicationTime: true,
                financingType: true,
                higherEducation: true,
                scholarship: true,
                scholarshipType: true,
                teachingLadder: true,
            },
            where,
            take: limit,
            skip: PaginationDto.getOffset(limit, page),
        });

        return {
            data: response[0],
            pagination: {limit, totalItems: response[1]},
        };
    }

    private async filterByHolidays(holidays: Date): Promise<ServiceResponseHttpModel> {
        const where: FindOptionsWhere<InformationTeacherEntity> = {};

        if (holidays) {
            where.holidays = LessThan(holidays);
        }

        const response = await this.repository.findAndCount({
            relations: {
                countryHigherEducation: true,
                dedicationTime: true,
                financingType: true,
                higherEducation: true,
                scholarship: true,
                scholarshipType: true,
                teachingLadder: true,
            },
            where,
        });

        return {
            data: response[0],
            pagination: {limit: 10, totalItems: response[1]},
        };
    }

    async hide(id: string): Promise<InformationTeacherEntity> {
        const entity = await this.repository.findOneBy({id});

        if (!entity) {
            throw new NotFoundException(MessageEnum.NOT_FOUND);
        }
        entity.isVisible = false;
        return await this.repository.save(entity);
    }

    async reactivate(id: string): Promise<InformationTeacherEntity> {
        const entity = await this.repository.findOneBy({id});

        if (!entity) {
            throw new NotFoundException(MessageEnum.NOT_FOUND);
        }
        entity.isVisible = true;
        return await this.repository.save(entity);
    }
}

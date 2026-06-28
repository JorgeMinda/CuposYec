import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {FindOptionsWhere, ILike, LessThan, Repository} from 'typeorm';
import {CreateCurriculumDto, FilterCurriculumDto, PaginationDto, UpdateCurriculumDto} from '@core/dto';
import {CareerEntity, CurriculumEntity, SubjectEntity} from '@core/entities';
import {CareersService, CataloguesService, InstitutionsService} from '@core/services';
import {ServiceResponseHttpModel} from '@shared/models';
import {CoreRepositoryEnum, MessageEnum} from '@shared/enums';

@Injectable()
export class CurriculumsService {
    constructor(
        @Inject(CoreRepositoryEnum.CURRICULUM_REPOSITORY)
        private repository: Repository<CurriculumEntity>,
        private careerService: CareersService,
        //private institutionsService: InstitutionsService,
        private catalogueService: CataloguesService,
    ) {
    }

    async create(payload: CreateCurriculumDto): Promise<CurriculumEntity> {
        const newCurriculum = this.repository.create(payload);

        return await this.repository.save(newCurriculum);
    }

    async findAll(params?: FilterCurriculumDto): Promise<ServiceResponseHttpModel> {
        // Filter by search
        if (params?.limit && params?.page) return await this.paginateAndFilter(params);

        // Other filters
        if (params?.weeksNumber) return await this.filterByWeeksNumber(params.weeksNumber);

        //All
        const data = await this.repository.findAndCount({
            relations: {career: true, state: true},
        });

        return {data: data[0], pagination: {totalItems: data[1], limit: 10}};
    }

    async findOne(id: string): Promise<CurriculumEntity> {
        const curriculum = await this.repository.findOne({
            relations: {career: true, state: true},
            where: {
                id,
            },
        });

        if (!curriculum) {
            throw new NotFoundException('El producto no se encontro');
        }

        return curriculum;
    }

    async update(id: string, payload: UpdateCurriculumDto): Promise<CurriculumEntity> {
        const curriculum = await this.repository.findOne({
            relations: {career: true, state: true},
            where: {
                id,
            },
        });

        if (!curriculum) {
            throw new NotFoundException('El producto no se encontro');
        }

        //curriculum.career = await this.careerService.findOne(payload.career.id);
        //curriculum.state = await this.catalogueService.findOne(payload.state.id);

        this.repository.merge(curriculum, payload);

        return await this.repository.save(curriculum);
    }

    async remove(id: string): Promise<CurriculumEntity> {
        const curriculum = await this.repository.findOneBy({id});

        if (!curriculum) {
            throw new NotFoundException('La malla curricular no se encontró');
        }

        return await this.repository.softRemove(curriculum);
    }

    async removeAll(payload: CurriculumEntity[]): Promise<CurriculumEntity[]> {
        return await this.repository.softRemove(payload);
    }

    async hide(id: string): Promise<CurriculumEntity> {
        const entity = await this.repository.findOneBy({id});

        if (!entity) {
            throw new NotFoundException(MessageEnum.NOT_FOUND);
        }

        entity.isVisible = false;

        return await this.repository.save(entity);
    }

    async reactivate(id: string): Promise<CurriculumEntity> {
        const entity = await this.repository.findOneBy({id});

        if (!entity) {
            throw new NotFoundException(MessageEnum.NOT_FOUND);
        }

        entity.isVisible = true;

        return await this.repository.save(entity);
    }

    private async paginateAndFilter(params: FilterCurriculumDto): Promise<ServiceResponseHttpModel> {
        let where: FindOptionsWhere<CurriculumEntity> | FindOptionsWhere<CurriculumEntity>[];
        where = {};
        let {page, search} = params;
        const {limit} = params;

        if (search) {
            search = search.trim();
            page = 0;
            where = [];
            where.push({code: ILike(`%${search}%`)});
            where.push({description: ILike(`%${search}%`)});
            where.push({name: ILike(`%${search}%`)});
            where.push({resolutionNumber: ILike(`%${search}%`)});
        }

        const response = await this.repository.findAndCount({
            relations: {career: true, state: true},
            where,
            skip: PaginationDto.getOffset(limit, page),
            take: limit,
        });

        return {
            data: response[0],
            pagination: {limit, totalItems: response[1]},
        };
    }

    private async filterByWeeksNumber(weeksNumber: number): Promise<ServiceResponseHttpModel> {
        const where: FindOptionsWhere<CurriculumEntity> = {};

        if (weeksNumber) {
            where.weeksNumber = LessThan(weeksNumber);
        }

        const response = await this.repository.findAndCount({
            relations: {career: true, state: true},
            where,
        });

        return {
            data: response[0],
            pagination: {limit: 10, totalItems: response[1]},
        };
    }
}

import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InformationStudentEntity} from '@core/entities';
import {
    CreateInformationStudentDto,
    SeederInformationStudentDto,
    UpdateInformationStudentDto
} from '@core/dto';
import {CataloguesService} from '@core/services';
import {CoreRepositoryEnum} from '@shared/enums';

@Injectable()
export class InformationStudentsService {
    constructor(
        @Inject(CoreRepositoryEnum.INFORMATION_STUDENT_REPOSITORY)
        private repository: Repository<InformationStudentEntity>,
        private cataloguesService: CataloguesService,
    ) {
    }

    async create(payload: CreateInformationStudentDto | SeederInformationStudentDto): Promise<InformationStudentEntity> {
        const newInformationStudent = this.repository.create(payload);

        return await this.repository.save(newInformationStudent);
    }

    async findOne(id: string): Promise<InformationStudentEntity> {
        const informationStudent = await this.repository.findOne({
            relations: {
                // isAncestralLanguage: true,
                // isBonusDevelopmentReceive: true,
                // isDegreeSuperior: true,
                isDisability: true,
                isSubjectLost: true
            },
            where: {id},
        });

        if (informationStudent === null) {
            throw new NotFoundException('La informacion no se encontro');
        }

        return informationStudent;
    }

    async update(id: string, payload: UpdateInformationStudentDto): Promise<InformationStudentEntity> {
        const informationStudent = await this.repository.findOneBy({id});

        if (informationStudent === null) {
            throw new NotFoundException('La informacion del estudiante no se encontro');
        }

        this.repository.merge(informationStudent, payload);

        return await this.repository.save(informationStudent);
    }

    async remove(id: string): Promise<InformationStudentEntity> {
        const informationStudent = await this.repository.findOneBy({id});

        if (!informationStudent) {
            throw new NotFoundException('Information Student not found');
        }

        return await this.repository.save(informationStudent);
    }
}

import {Inject, Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {SeedSubjectRequirementDto} from '@core/dto';
import {SubjectCorequisiteEntity} from '@core/entities';
import {CoreRepositoryEnum} from '@shared/enums';

@Injectable()
export class SubjectCorequisitesService {
    constructor(
        @Inject(CoreRepositoryEnum.SUBJECT_COREQUISITE_REPOSITORY)
        private repository: Repository<SubjectCorequisiteEntity>,
    ) {
    }

    async createCorequisite(payload: SeedSubjectRequirementDto): Promise<SubjectCorequisiteEntity> {
        const entity = this.repository.create(payload);
        return await this.repository.save(entity);
    }

    async create(subjectId: string, payload: SubjectCorequisiteEntity): Promise<SubjectCorequisiteEntity> {
        const subjectRequirement = new SubjectCorequisiteEntity();
        subjectRequirement.subjectId = subjectId;
        subjectRequirement.requirementId = payload.id;
        subjectRequirement.isEnabled = payload.isEnabled;

        const entity = this.repository.create(subjectRequirement);

        return await this.repository.save(entity);
    }

    async removeBySubject(subjectId: string) {
        const subjectCorequisites = await this.repository.find({
            where: {subjectId},
        });

        await this.repository.softRemove(subjectCorequisites);
    }
}

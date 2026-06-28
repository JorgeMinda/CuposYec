import {Inject, Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {SeedSubjectRequirementDto} from '@core/dto';
import {SubjectPrerequisiteEntity} from '@core/entities';
import {CoreRepositoryEnum} from '@shared/enums';

@Injectable()
export class SubjectPrerequisitesService {
    constructor(
        @Inject(CoreRepositoryEnum.SUBJECT_PREREQUISITE_REPOSITORY)
        private repository: Repository<SubjectPrerequisiteEntity>,
    ) {
    }

    async createPrerequisite(payload: SeedSubjectRequirementDto): Promise<SubjectPrerequisiteEntity> {
        const entity = this.repository.create(payload);
        return await this.repository.save(entity);
    }

    async create(subjectId: string, payload: SubjectPrerequisiteEntity): Promise<SubjectPrerequisiteEntity> {
        const subjectRequirement = new SubjectPrerequisiteEntity();
        subjectRequirement.subjectId = subjectId;
        subjectRequirement.requirementId = payload.id;
        subjectRequirement.isEnabled = payload.isEnabled;

        const entity = this.repository.create(subjectRequirement);

        return await this.repository.save(entity);
    }

    async removeBySubject(subjectId: string) {
        const subjectPrerequisites = await this.repository.find({
            where: {subjectId},
        });

        await this.repository.softRemove(subjectPrerequisites);
    }
}

import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {plainToInstance} from 'class-transformer';
import {Repository} from 'typeorm';
import {CreateAuditDto, ReadMenuDto, UpdateMenuDto} from '@auth/dto';
import {AuditEntity} from '@auth/entities';
import {AuthRepositoryEnum} from '@shared/enums';
import {ServiceResponseHttpModel} from '@shared/models';

@Injectable()
export class AuditsService {
    constructor(
        @Inject(AuthRepositoryEnum.AUDIT_REPOSITORY)
        private repository: Repository<AuditEntity>,
    ) {
    }

    async create(payload: CreateAuditDto): Promise<AuditEntity> {
        const newEntity: AuditEntity = this.repository.create(payload);

        return await this.repository.save(newEntity);
    }


    async update(id: string, payload: UpdateMenuDto): Promise<ServiceResponseHttpModel> {
        const menu = await this.repository.preload({id, ...payload});

        if (!menu) {
            throw new NotFoundException('Menu not found');
        }

        const menuUpdated = await this.repository.save(menu);

        return {data: plainToInstance(ReadMenuDto, menuUpdated)};
    }
}

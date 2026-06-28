import {Inject, Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {CreateResidenceAddressDto, UpdateResidenceAddressDto} from '@core/dto';
import {ResidenceAddressEntity} from '@core/entities';
import {CoreRepositoryEnum} from '@shared/enums';

@Injectable()
export class ResidenceAddressesService {
    constructor(
        @Inject(CoreRepositoryEnum.RESIDENCE_ADDRESS_REPOSITORY)
        private repository: Repository<ResidenceAddressEntity>,
    ) {
    }

    async create(payload: CreateResidenceAddressDto): Promise<ResidenceAddressEntity> {
        const entity = this.repository.create(payload);

        return await this.repository.save(entity);
    }

    async update(id: string, payload: UpdateResidenceAddressDto): Promise<boolean> {
        await this.repository.update(id, payload);
        return true;
    }
}

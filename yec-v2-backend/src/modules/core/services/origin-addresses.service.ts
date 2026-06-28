import {Inject, Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {CreateOriginAddressDto, UpdateOriginAddressDto} from '@core/dto';
import {CoreRepositoryEnum} from '@shared/enums';
import {OriginAddressEntity} from '@core/entities';

@Injectable()
export class OriginAddressesService {
    constructor(
        @Inject(CoreRepositoryEnum.ORIGIN_ADDRESS_REPOSITORY)
        private repository: Repository<OriginAddressEntity>,
    ) {
    }

    async create(payload: CreateOriginAddressDto): Promise<OriginAddressEntity> {
        const entity = this.repository.create(payload);

        return await this.repository.save(entity);
    }

    async update(id: string, payload: UpdateOriginAddressDto): Promise<boolean> {
        await this.repository.update(id, payload);
        return true;
    }
}

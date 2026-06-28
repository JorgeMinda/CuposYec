import {Inject, Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {CreateLocationDto} from '@core/dto';
import {CacheEnum, CoreRepositoryEnum} from '@shared/enums';
import {LocationEntity} from '@core/entities';
import {Cache} from "cache-manager";
import {CACHE_MANAGER} from '@nestjs/cache-manager';

@Injectable()
export class LocationsService {
    constructor(
        @Inject(CoreRepositoryEnum.LOCATION_REPOSITORY)
        private repository: Repository<LocationEntity>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {
    }

    async create(payload: CreateLocationDto): Promise<LocationEntity> {
        const entity = this.repository.create(payload);

        return await this.repository.save(entity);
    }

    async findByIdTemp(idTemp: string): Promise<LocationEntity> {
        const entity = await this.repository.findOne({where: {idTemp}});
        // if (!entity) throw new NotFoundException('DPA no encontrada');
        return entity;
    }

    async findCache(): Promise<LocationEntity[]> {
        let locations = (await this.cacheManager.get(CacheEnum.LOCATIONS)) as LocationEntity[];

        if (locations === null || locations === undefined || locations.length === 0) {
            locations = await this.repository.find({
                order: {name: 'asc'},
            });

            await this.cacheManager.set(CacheEnum.LOCATIONS, locations);
        }

        return locations;
    }

    async findCache2(): Promise<LocationEntity[]> {
        let locations = (await this.cacheManager.get(CacheEnum.LOCATIONS)) as LocationEntity[];

        if (locations === null || locations === undefined || locations.length === 0) {
            locations = await this.repository.find({
                relations: {
                    children: {
                        children: {
                            children: true
                        }
                    }
                },
                where: {level: 1},
                order: {name: 'asc'},
            });

            await this.cacheManager.set(CacheEnum.LOCATIONS, locations);
        }

        return locations;
    }

    async loadCache(): Promise<LocationEntity[]> {
        const locations = await this.repository.find({
            order: {name: 'asc'},
        });

        await this.cacheManager.set(CacheEnum.LOCATIONS, locations);

        return locations;
    }

    async loadCache2(): Promise<LocationEntity[]> {
        const locations = await this.repository.find({
            relations: {
                children: {
                    children: {
                        children: true
                    }
                }
            },
            where: {level: 1},
            order: {name: 'asc'},
        });

        await this.cacheManager.set(CacheEnum.LOCATIONS, locations);

        return locations;
    }
}

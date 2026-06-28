import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CreateInstitutionDto, FilterInstitutionDto, PaginationDto, UpdateInstitutionDto } from '@core/dto';
import { InstitutionEntity } from '@core/entities';
import { CataloguesService } from '@core/services';
import { ServiceResponseHttpModel } from '@shared/models';
import { CoreRepositoryEnum } from '@shared/enums';
import { ResidenceAddressEntity } from '@core/entities';

@Injectable()
export class AddressesService {
  constructor(
    @Inject(CoreRepositoryEnum.ADDRESS_REPOSITORY)
    private repository: Repository<ResidenceAddressEntity>,
    private cataloguesService: CataloguesService,
  ) {}

  /*
      async create(payload: CreateA): Promise<InstitutionEntity> {
        const newInstitution = this.repository.create(payload);
    
        return await this.repository.save(newInstitution);
      }
    
      async findAll(params?: FilterInstitutionDto): Promise<ServiceResponseHttpModel> {
        //Pagination & Filter by search
        if (params?.limit > 0 && params?.page >= 0) {
          return await this.paginateAndFilter(params);
        }
    
        //Other filters
        // if (params.numberStudents) {
        //   return await this.filterByNumberStudents(params.numberStudents);
        // }
    
        //All
        const data = await this.repository.findAndCount({
          relations: ['address', 'state'],
        });
        return { data: data[0], pagination: { totalItems: data[1], limit: 10 } };
      }
    
      async findOne(id: string): Promise<InstitutionEntity> {
        const institution = await this.repository.findOne({
          relations: ['address', 'state'],
          where: { id },
        });
        if (!institution) throw new NotFoundException('Institution not found');
    
        return institution;
      }
    
      async update(id: string, payload: UpdateInstitutionDto): Promise<InstitutionEntity> {
        const institution = await this.repository.findOneBy({ id });
    
        if (!institution) throw new NotFoundException('Institution not found');
    
        this.repository.merge(institution, payload);
    
        return await this.repository.save(institution);
      }
    
      async remove(id: string): Promise<InstitutionEntity> {
        const institution = await this.repository.findOneBy({ id });
    
        if (!institution) throw new NotFoundException('Institution not found');
    
        return await this.repository.softRemove(institution);
      }
    
      async removeAll(payload: InstitutionEntity[]): Promise<InstitutionEntity[]> {
        return await this.repository.softRemove(payload);
      }
    
      private async paginateAndFilter(params: FilterInstitutionDto): Promise<ServiceResponseHttpModel> {
        let where: FindOptionsWhere<InstitutionEntity> | FindOptionsWhere<InstitutionEntity>[];
        where = {};
        let { page, search } = params;
        const { limit } = params;
    
        if (search) {
          search = search.trim();
          page = 0;
          where = [];
          where.push({ acronym: ILike(`%${search}`) });
          where.push({ cellphone: ILike(`%${search}`) });
          where.push({ code: ILike(`%${search}`) });
          where.push({ codeSniese: ILike(`%${search}`) });
          where.push({ denomination: ILike(`%${search}`) });
          where.push({ email: ILike(`%${search}`) });
          where.push({ logo: ILike(`%${search}`) });
          where.push({ name: ILike(`%${search}`) });
          where.push({ phone: ILike(`%${search}`) });
          where.push({ shortName: ILike(`%${search}`) });
          where.push({ slogan: ILike(`%${search}`) });
          where.push({ web: ILike(`%${search}`) });
        }
    
        const response = await this.repository.findAndCount({
          relations: ['address', 'state'],
          where,
          take: limit,
          skip: PaginationDto.getOffset(limit, page),
        });
    
        return {
          data: response[0],
          pagination: { limit, totalItems: response[1] },
        };
      }
      */
}

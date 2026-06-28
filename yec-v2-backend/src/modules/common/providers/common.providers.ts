import { DataSource } from 'typeorm';
import { ConfigEnum, CommonRepositoryEnum } from '@shared/enums';
import { FileEntity } from '@common/entities';

export const commonProviders = [
  {
    provide: CommonRepositoryEnum.FILE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(FileEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
];

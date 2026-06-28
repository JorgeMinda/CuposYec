import {DataSource} from 'typeorm';
import {
    MenuEntity,
    TransactionalCodeEntity,
    PermissionEntity,
    RoleEntity,
    UserEntity,
    AuditEntity
} from '@auth/entities';
import {ConfigEnum, AuthRepositoryEnum} from '@shared/enums';

export const authProviders = [
    {
        provide: AuthRepositoryEnum.AUDIT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(AuditEntity),
        inject: [ConfigEnum.PG_DATA_SOURCE],
    },
    {
        provide: AuthRepositoryEnum.MENU_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(MenuEntity),
        inject: [ConfigEnum.PG_DATA_SOURCE],
    },
    {
        provide: AuthRepositoryEnum.PERMISSION_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(PermissionEntity),
        inject: [ConfigEnum.PG_DATA_SOURCE],
    },
    {
        provide: AuthRepositoryEnum.ROLE_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(RoleEntity),
        inject: [ConfigEnum.PG_DATA_SOURCE],
    },
    {
        provide: AuthRepositoryEnum.USER_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(UserEntity),
        inject: [ConfigEnum.PG_DATA_SOURCE],
    },
    {
        provide: AuthRepositoryEnum.TRANSACTIONAL_CODE_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(TransactionalCodeEntity),
        inject: [ConfigEnum.PG_DATA_SOURCE],
    },
];

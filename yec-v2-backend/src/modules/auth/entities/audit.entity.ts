import {
    PrimaryGeneratedColumn,
    Column,
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn, ManyToOne
} from 'typeorm';
import {UserEntity} from '@auth/entities';

@Entity('audits', { schema: 'core' })
export class AuditEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;

    /** Foreign Keys **/
    @Column({
        name: 'model_id',
        type: 'varchar',
        nullable: true,
        comment: 'Foreign Key de cualquier otra entidad',
    })
    modelId: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({name: 'user_id'})
    user: UserEntity;

    /** Columns **/
    @Column({
        name: 'event',
        type: 'varchar',
        comment: '',
    })
    event: string;

    @Column({
        name: 'hostname',
        type: 'varchar',
        comment: '',
    })
    hostname: string;

    @Column({
        name: 'ip_address',
        type: 'varchar',
        comment: '',
    })
    ipAddress: string;

    @Column({
        name: 'url',
        type: 'text',
        comment: '',
    })
    url: string;

    @Column({
        name: 'new_values',
        type: 'text',
        nullable: true,
        comment: '',
    })
    values: string;
}

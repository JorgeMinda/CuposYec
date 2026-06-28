import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('transactional_codes', { schema: 'core' })
export class TransactionalCodeEntity {
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

  /** Columns **/
  @Column({
    name: 'username',
    type: 'varchar',
    comment: 'Nombre de usuario',
  })
  username: string;

  @Column({
    name: 'token',
    type: 'varchar',
    comment: 'Token',
  })
  token: string;

  @Column({
    name: 'is_used',
    type: 'boolean',
    default: false,
    comment: 'true=used, false=no used',
  })
  isUsed: boolean;

  @Column({
    name: 'type',
    type: 'varchar',
    comment: 'Type',
  })
  type: string;
}

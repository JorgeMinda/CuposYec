import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { MenuEntity, PermissionEntity, UserEntity } from '@auth/entities';

@Entity('roles', { schema: 'core' })
export class RoleEntity {
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

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  deletedAt: Date;

  @Column({
    name: 'is_visible',
    type: 'boolean',
    default: true,
    comment: 'true=visible, false=no visible',
  })
  isVisible: boolean;

  /** Inverse Relationship **/
  @ManyToMany(() => UserEntity, user => user.roles)
  @JoinTable({
    name: 'role_user',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  users: UserEntity[];

  @ManyToMany(() => MenuEntity)
  @JoinTable({
    name: 'menu_role',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'menu_id' },
  })
  menus: MenuEntity[];

  @ManyToMany(() => PermissionEntity)
  @JoinTable({
    name: 'permission_role',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'permission_id' },
  })
  permissions: PermissionEntity[];

  /** Columns **/
  @Column({
    name: 'code',
    type: 'varchar',
    unique: true,
    comment: 'Codigo del rol',
  })
  code: string;

  @Column({
    name: 'name',
    type: 'varchar',
    unique: true,
    comment: 'Nombre del rol',
  })
  name: string;

  /** Before Actions **/
  @BeforeInsert()
  @BeforeUpdate()
  async setCode() {
    if (!this.code) {
      return;
    }
    this.code = this.code.toLowerCase().trim();
  }
}

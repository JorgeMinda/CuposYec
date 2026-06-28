import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CatalogueEntity, SchoolPeriodEntity } from '@core/entities';
import { UserEntity } from '@auth/entities';

@Entity('auto_evaluations', { schema: 'teacher_evaluation' })
export class AutoEvaluationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_timestamp',
    comment: 'Fecha de creacion del registro',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_timestamp',
    comment: 'Fecha de actualizacion del registro',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    comment: 'Fecha de eliminacion del registro',
  })
  deletedAt: Date;

  /** Foreign Keys **/
  @ManyToOne(() => CatalogueEntity)
  @JoinColumn({ name: 'evaluation_type_id' })
  evaluationType: CatalogueEntity;
  @Column({ type: 'uuid', name: 'evaluation_type_id', comment: 'FK' })
  evaluationTypeId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'evaluated_id' })
  evaluated: UserEntity;
  @Column({ type: 'uuid', name: 'evaluated_id', comment: 'FK Docente Evaluado' })
  evaluatedId: string;

  @ManyToOne(() => SchoolPeriodEntity)
  @JoinColumn({ name: 'school_period_id' })
  schoolPeriod: SchoolPeriodEntity;
  @Column({ type: 'uuid', name: 'school_period_id', comment: 'FK Periodo Lectivo' })
  schoolPeriodId: string;

  /** Columns **/
  @Column({
    name: 'enabled',
    type: 'boolean',
    default: true,
    comment: 'true = habilitado, false = deshabilitado',
  })
  enabled: boolean;

  @Column({
    name: 'total_score',
    type: 'float',
    nullable: true,
    comment: 'Puntaje total de las respuestas',
  })
  totalScore: number;
}

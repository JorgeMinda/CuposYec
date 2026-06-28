import {
    PrimaryGeneratedColumn,
    Column,
    Entity,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany
} from 'typeorm';
import {CatalogueEntity, CurriculumEntity, SubjectCorequisiteEntity, SubjectPrerequisiteEntity} from '@core/entities';

@Entity('subjects', {schema: 'core'})
export class SubjectEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_timestamp',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_timestamp',
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

    @Column({
        name: 'is_enabled',
        type: 'boolean',
        default: true,
        comment: 'true=enabled, false=disabled',
    })
    isEnabled: boolean;

    /** Inverse Relationship **/
    @OneToMany(() => SubjectCorequisiteEntity, subjectCorequisite => subjectCorequisite.subject)
    subjectCorequisites: SubjectCorequisiteEntity[];

    @OneToMany(() => SubjectPrerequisiteEntity, subjectPrerequisite => subjectPrerequisite.subject)
    subjectPrerequisites: SubjectPrerequisiteEntity[];

    /** Foreign Keys **/
    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'academic_period_id'})
    academicPeriod: CatalogueEntity;
    @Column({type: 'uuid', name: 'academic_period_id', comment: 'Periodo academico que pertenece'})
    academicPeriodId: string;

    @ManyToOne(() => CurriculumEntity, {nullable: true})
    @JoinColumn({name: 'curriculum_id'})
    curriculum: CurriculumEntity;
    @Column({type: 'uuid', name: 'curriculum_id', comment: 'Curriculum'})
    curriculumId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'state_id'})
    state: CatalogueEntity;
    @Column({type: 'uuid', name: 'state_id', nullable:true, comment: 'Habilitado o Inhabilitado'})
    stateId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'type_id'})
    type: CatalogueEntity;
    @Column({type: 'uuid', name: 'type_id', comment: 'Intensiva'})
    typeId: string;

    /** Columns **/
    @Column({
        name: 'autonomous_hour',
        type: 'int',
        default: 0,
        comment: 'Hora autónoma de la asignatura',
    })
    autonomousHour: number;

    @Column({
        name: 'code',
        type: 'varchar',
        comment: 'Código de la asignatura',
    })
    code: string;

    @Column({
        name: 'credits',
        type: 'int',
        nullable: true,
        default: 0,
        comment: 'Creditos de la asignatura',
    })
    credits: number;

    @Column({
        name: 'name',
        type: 'varchar',
        default: 'SN',
        comment: 'Nombre de la asignatura',
    })
    name: string;

    @Column({
        name: 'practical_hour',
        type: 'int',
        default: 0,
        comment: 'Horas prácticas de la asignatura',
    })
    practicalHour: number;

    @Column({
        name: 'scale',
        type: 'float',
        default: 0,
        comment: 'ponderable de la asignatura',
    })
    scale: number;

    @Column({
        name: 'teacher_hour',
        type: 'int',
        default: 0,
        comment: 'Horas del docente',
    })
    teacherHour: number;
}

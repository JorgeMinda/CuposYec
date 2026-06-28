import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {CareerEntity, CatalogueEntity, SubjectEntity} from '@core/entities';

@Entity('curriculums', {schema: 'core'})
export class CurriculumEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_timestampP'
    })
    created_at: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_timestamp',
    })
    updatedAT: Date;

    @DeleteDateColumn({
        name: 'deleted_at',
        type: 'timestamp',
        nullable: true,
    })
    deletedAT: Date;

    @Column({
        name: 'is_visible',
        type: 'boolean',
        default: true,
        comment: 'true=visible, false=no visible',
    })
    isVisible: boolean;

    /** Inverse Relationship **/
    @OneToMany(() => SubjectEntity, subject => subject.curriculum)
    subjects: SubjectEntity[];

    /** Foreign Keys **/
    @ManyToOne(() => CareerEntity, {nullable: true})
    @JoinColumn({name: 'career_id'})
    career: CareerEntity;
    @Column({type: 'uuid', name: 'career_id', comment: 'Marketing, Desarollo de software'})
    careerId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: false})
    @JoinColumn({name: 'state_id'})
    state: CatalogueEntity;
    @Column({type: 'uuid', name: 'state_id',nullable:true, comment: 'Habilitado o Inhabilitado'})
    stateId: string;

    /** Columns **/
    @Column({
        name: 'code',
        type: 'varchar',
        default: 'SN',
        comment: 'Codigo de la malla',
    })
    code: string;

    @Column({
        name: 'name',
        type: 'varchar',
        default: 'SN',
        comment: 'Nombre de la malla',
    })
    name: string;

    @Column({
        name: 'description',
        type: 'varchar',
        default: 'SN',
        comment: 'Descripcion de la mall',
    })
    description: string;

    @Column({
        name: 'resolution_number',
        type: 'varchar',
        default: 'SN',
        comment: 'Numero de resolucion',
    })
    resolutionNumber: string;

    @Column({
        name: 'periodic_academic_number',
        type: 'int',
        comment: 'numero de periodos academicos',
    })
    periodicAcademicNumber: number;

    @Column({
        name: 'weeks_Number',
        type: 'int',
        comment: 'Numeros de semanas',
    })
    weeksNumber: number;
}

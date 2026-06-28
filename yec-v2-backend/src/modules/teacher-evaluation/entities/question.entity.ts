import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { CatalogueEntity } from '@core/entities';
import { ResponseEntity } from './response.entity';

@Entity('questions', { schema: 'teacher_evaluation' })
export class QuestionEntity {
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

    /** Inverse Relationship **/
    @OneToMany(() => ResponseEntity, response => response.question)
    responses: ResponseEntity[];

    /** Foreign Keys **/
    @ManyToOne(() => CatalogueEntity)
    @JoinColumn({ name: 'evaluation_type_id' })
    evaluationType: CatalogueEntity;
    @Column({ type: 'uuid', name: 'evaluation_type_id', comment: 'FK' })
    evaluationTypeId: string;

    @ManyToOne(() => CatalogueEntity, category => category.children, {nullable: true})
    @JoinColumn({ name: 'category_id' })
    category: CatalogueEntity;
    @Column({ type: 'uuid', name: 'category_id', nullable: true, comment: 'FK for category, linked to CatalogueEntity', })
    categoryId: string;

    /** Columns **/
    @Column({
        name: 'code',
        type: 'varchar',
        comment: 'Código de la pregunta',
    })
    code: string;

    @Column({
        name: 'description',
        type: 'text',
        comment: 'Descripción de la pregunta',
    })
    description: string;

    @Column({
        name: 'name',
        type: 'text',
        comment: 'Nombre de la pregunta',
    })
    name: string;

    @Column({
        name: 'sort',
        type: 'int',
        comment: 'Orden de la pregunta',
    })
    sort: number;

    @Column({
        name: 'type',
        type: 'varchar',
        nullable: true,
        comment: 'Tipo de la pregunta',
    })
    type: string;
}

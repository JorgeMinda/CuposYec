import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { QuestionEntity } from './question.entity';

@Entity('responses', {schema: 'teacher_evaluation'})
export class ResponseEntity {
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
    @ManyToOne(() => QuestionEntity)
    @JoinColumn({name: 'question_id'})
    question: QuestionEntity;
    @Column({type: 'uuid', name: 'question_id', comment: 'FK'})
    questionId: string;

    /** Columns **/
    @Column({
        name: 'code',
        type: 'varchar',
        comment: 'Código de la respuesta',
    })
    code: string;

    @Column({
        name: 'description',
        type: 'text',
        comment: 'Descripción de la respuesta',
    })
    description: string;

    @Column({
        name: 'name',
        type: 'text',
        comment: 'Nombre de la respuesta',
    })
    name: string;

    @Column({
        name: 'score',
        type: 'float',
        comment: 'Puntaje de la respuesta',
    })
    score: number;

    @Column({
        name: 'sort',
        type: 'int',
        comment: 'Orden de la pregunta',
    })
    sort: number;
}

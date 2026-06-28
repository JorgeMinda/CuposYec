import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, JoinColumn, ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ResponseEntity } from './response.entity';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@Entity('results', {schema: 'teacher_evaluation'})
export class ResultEntity {
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
    @Column({
        name: 'model_id',
        type: 'uuid',
        nullable:true,
        comment: 'Foreign Key de cualquier otra entidad (auto_evaluations, coordinator_evaluations, partner_evaluations, student_evaluations)' ,
    })
    modelId: UUID;

    @ManyToOne(() => ResponseEntity)
    @JoinColumn({name: 'response_id'})
    response: ResponseEntity;
    @Column({type: 'uuid', name: 'response_id', comment: 'FK'})
    responseId: string;

    /** Columns **/
    @Column({
        name: 'score',
        type: 'float',
        comment: 'Puntaje de la respuesta',
    })
    score: number;
}

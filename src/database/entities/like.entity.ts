import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { AbstractEntity } from '../abstract-base.entity';
import { CaseEntity } from './case.entity';

@Entity('likes')
@Unique(['sessionId', 'case'])
export class LikeEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_like_id',
  })
  id: number;

  @Column({
    name: 'session_id',
    type: 'varchar',
    nullable: false,
  })
  sessionId: string;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    default: null,
  })
  deletedAt: Date;

  @ManyToOne(() => CaseEntity, (caseEntity) => caseEntity.likes)
  @JoinColumn({
    name: 'case_id',
    foreignKeyConstraintName: 'FK_case_like_id',
  })
  case: CaseEntity;
}

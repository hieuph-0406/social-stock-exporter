import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntity } from '../abstract-base.entity';
import { CaseEntity } from './case.entity';

@Entity('categories')
export class CategoryEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_category_id',
  })
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    default: null,
  })
  deletedAt: Date;

  @ManyToOne(
    () => CategoryEntity,
    (categoryEntity) => categoryEntity.subCategories,
    {
      nullable: true,
    },
  )
  @JoinColumn({
    name: 'parent_id',
    foreignKeyConstraintName: 'FK_parent_id',
  })
  parent: CategoryEntity;

  @OneToMany(() => CategoryEntity, (categoryEntity) => categoryEntity.parent)
  subCategories: CategoryEntity[];

  @OneToMany(() => CaseEntity, (caseEntity) => caseEntity.category)
  cases: CaseEntity[];
}

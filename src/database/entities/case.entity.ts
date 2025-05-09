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
import { CategoryEntity } from './category.entity';
import { LikeEntity } from './like.entity';
import { PhoneEntity } from './phone.entity';

@Entity('cases')
export class CaseEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_case_id',
  })
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    name: 'image_url',
    type: 'varchar',
    nullable: false,
  })
  imageUrl: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({
    name: 'buy_link',
    type: 'varchar',
    nullable: false,
  })
  buyLink: string;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    default: null,
  })
  deletedAt: Date;

  @OneToMany(() => LikeEntity, (likeEntity) => likeEntity.case)
  likes: LikeEntity[];

  @ManyToOne(() => PhoneEntity, (phoneEntity) => phoneEntity.cases)
  @JoinColumn({
    name: 'phone_id',
    foreignKeyConstraintName: 'FK_case_phone_id',
  })
  phone: PhoneEntity;

  @ManyToOne(() => CategoryEntity, (categoryEntity) => categoryEntity.cases)
  @JoinColumn({
    name: 'category_id',
    foreignKeyConstraintName: 'FK_case_category_id',
  })
  category: CategoryEntity;
}

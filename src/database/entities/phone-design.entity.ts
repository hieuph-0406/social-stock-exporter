import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntity } from '../abstract-base.entity';
import { PhoneEntity } from './phone.entity';

@Entity('phone_designs')
export class PhoneDesignEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_phone_design_id',
  })
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  color: string;

  @Column({
    name: 'image_url',
    type: 'varchar',
    nullable: false,
  })
  imageUrl: string;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    default: null,
  })
  deletedAt: Date;

  @ManyToOne(() => PhoneEntity, (phoneEntity) => phoneEntity.phoneDesigns)
  @JoinColumn({
    name: 'phone_id',
    foreignKeyConstraintName: 'FK_phone_design_phone_id',
  })
  phone: PhoneEntity;
}

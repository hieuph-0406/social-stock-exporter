import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntity } from '../abstract-base.entity';
import { CaseEntity } from './case.entity';
import { PhoneDesignEntity } from './phone-design.entity';

@Entity('phones')
export class PhoneEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_phone_id' })
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  brand: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  model: string;

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

  @OneToMany(
    () => PhoneDesignEntity,
    (phoneDesignEntity) => phoneDesignEntity.phone,
  )
  phoneDesigns: PhoneDesignEntity[];

  @OneToMany(() => CaseEntity, (caseEntity) => caseEntity.phone)
  cases: CaseEntity[];
}

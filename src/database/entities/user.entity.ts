import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntity } from '../abstract-base.entity';

@Entity('user')
export class UserEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_user_id' })
  id!: string;

  @Column({
    name: 'email',
    type: 'varchar',
    nullable: false,
  })
  email!: string;

  @Column({
    name: 'password',
    type: 'varchar',
    nullable: false,
  })
  password!: string;

  @Column({
    name: 'is_first_login',
    type: 'boolean',
    default: true,
    nullable: false,
  })
  isFirstLogin!: boolean;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    default: null,
  })
  deletedAt: Date;
}

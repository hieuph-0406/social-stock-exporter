import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_comment_id',
  })
  id: string;

  @Column('text')
  content: string;
}

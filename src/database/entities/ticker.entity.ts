import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tickers')
export class TickerEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_ticker_id',
  })
  id: string;

  @Column('text')
  code: string;
}

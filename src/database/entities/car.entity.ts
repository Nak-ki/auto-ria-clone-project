import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { TableNameEnum } from '../enums/table-name.enum';
import { UserEntity } from '../user.entity';
import { BaseModel } from './base.model';

@Entity({ name: TableNameEnum.CARS })
export class CarEntity extends BaseModel {
  @Column('text')
  brand: string;

  @Column('text', { unique: true })
  model: string;

  @Column('text')
  price: string;

  @Column('text', { default: 'UAH' })
  baseCurrency: string;

  @Column('text')
  currency: string;

  @Column('text')
  rate: string;

  @Column('text')
  year: string;

  @Column('text', { nullable: true })
  image?: string;

  @Column('text', { default: false })
  isActive: boolean;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.cars)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}

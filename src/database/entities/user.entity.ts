import { Column, Entity, OneToMany } from 'typeorm';

import { UserAccountEnum } from '../../modules/roles-users/user/enums/user-account.enum';
import { UserRoleEnum } from '../../modules/roles-users/user/enums/user-role.enum';
import { CarEntity } from './car.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';
import { RefreshTokenEntity } from './refresh-token.entity';

@Entity({ name: TableNameEnum.USERS })
export class UserEntity extends BaseModel {
  @Column('text')
  name: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text')
  password: string;

  @Column('text', { unique: true })
  phone: string;

  @Column('enum', { enum: UserRoleEnum, default: UserRoleEnum.SELLER })
  role: UserRoleEnum;

  @Column('text', { nullable: true })
  image?: string;

  @Column('text', { default: false })
  isBanned: boolean;

  @Column('enum', { enum: UserAccountEnum, default: UserAccountEnum.BASE })
  account: UserAccountEnum.BASE;

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokenEntity[];

  @OneToMany(() => CarEntity, (entity) => entity.user)
  cars?: CarEntity[];
}

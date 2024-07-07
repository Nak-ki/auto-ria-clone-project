import { Column, Entity, OneToMany } from 'typeorm';
import { ManagerAccountEnum } from "../../../modules/roles-users/manager/enums/manager-account.enum";

import { AdminAccountEnum } from '../../modules/roles-users/admin/enums/admin-account.enum';
import { UserRoleEnum } from '../../modules/roles-users/user/enums/user-role.enum';
import { TableNameEnum } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';
import { RefreshTokenEntity } from './refresh-token.entity';

@Entity({ name: TableNameEnum.MANAGER })
export class ManagerEntity extends BaseModel {
  @Column('text')
  name: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text')
  password: string;

  @Column('text', { unique: true, nullable: true })
  phone?: string;

  @Column('enum', { enum: UserRoleEnum, default: UserRoleEnum.MANAGER })
  role: UserRoleEnum;

  @Column('text', { nullable: true })
  image?: string;

  @Column('enum', { enum: ManagerAccountEnum, default: ManagerAccountEnum.PREMIUM })
  account: string;

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.admin)
  refreshTokens?: RefreshTokenEntity[];
}

import { AdminResDto } from '../../../roles-users/admin/dto/res/admin.res.dto';
import { ManagerResDto } from '../../../roles-users/manager/dto/res/manager.res.dto';
import { UserResDto } from '../../../roles-users/user/dto/res/user.res.dto';
import { TokenPairResDto } from './token-pair.res.dto';

export class AuthResDto {
  tokens: TokenPairResDto;
  user: UserResDto;
}

export class AuthResAdminDto {
  tokens: TokenPairResDto;
  admin: AdminResDto;
}

export class AuthResManagerDto {
  tokens: TokenPairResDto;
  manager: ManagerResDto;
}

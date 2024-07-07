import { AdminEntity } from '../../../database/entities/admin.entity';
import { ManagerEntity } from '../../../database/entities/manager.entity';
import { UserEntity } from '../../../database/entities/user.entity';
import { AdminMapper } from '../../roles-users/admin/services/admin.mapper';
import { ManagerMapper } from '../../roles-users/manager/services/manager.mapper';
import { UserMapper } from '../../roles-users/user/services/user.mapper';
import {
  AuthResAdminDto,
  AuthResDto,
  AuthResManagerDto,
} from '../dto/res/auth.res.dto';
import { TokenPairResDto } from '../dto/res/token-pair.res.dto';
import { ITokenPair } from '../interfaces/token-pair.interface';
import { IUserData } from '../interfaces/user-data.interface';

export class AuthMapper {
  public static toResponseDTO(
    user: UserEntity,
    tokenPair: ITokenPair,
  ): AuthResDto {
    return {
      tokens: {
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
      },
      user: UserMapper.toResponseDTO(user),
    };
  }

  public static toResponseAdminDTO(
    admin: AdminEntity,
    tokenPair: ITokenPair,
  ): AuthResAdminDto {
    return {
      tokens: {
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
      },
      admin: AdminMapper.toResponseDTO(admin),
    };
  }

  public static toResponseManagerDTO(
    manager: ManagerEntity,
    tokenPair: ITokenPair,
  ): AuthResManagerDto {
    return {
      tokens: {
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
      },
      manager: ManagerMapper.toResponseDTO(manager),
    };
  }

  public static toResponseTokensDTO(tokenPair: ITokenPair): TokenPairResDto {
    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    };
  }

  public static toUserDataDTO(user: UserEntity, deviceId: string): IUserData {
    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      deviceId,
    };
  }
}

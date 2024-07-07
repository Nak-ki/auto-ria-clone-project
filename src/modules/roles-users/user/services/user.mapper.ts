import { ConfigStaticService } from '../../../../configs/config.static';
import { UserEntity } from '../../../../database/entities/user.entity';
import { UserResDto } from '../dto/res/user.res.dto';

export class UserMapper {
  public static toResponseDTO(user: UserEntity): UserResDto {
    const awsConfig = ConfigStaticService.get().aws;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      image: user.image ? `${awsConfig.bucketUrl}/${user.image}` : null,
      isBanned: user.isBanned,
    };
  }
}

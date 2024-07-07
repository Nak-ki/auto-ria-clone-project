import { ConfigStaticService } from '../../../../configs/config.static';
import { UserEntity } from '../../../../database/entities/user.entity';
import { AdminResDto } from '../dto/res/admin.res.dto';

export class UserMapper {
  public static toResponseDTO(user: UserEntity): AdminResDto {
    const awsConfig = ConfigStaticService.get().aws;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio || null,
      image: user.image ? `${awsConfig.bucketUrl}/${user.image}` : null,
      isFollowed: user.followings ? user.followings.length > 0 : false,
    };
  }
}

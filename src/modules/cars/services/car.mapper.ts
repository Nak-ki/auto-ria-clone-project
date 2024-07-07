import { ConfigStaticService } from '../../../../configs/config.static';
import { AdminEntity } from '../../../../database/entities/admin.entity';
import { CarResDto } from '../dto/res/car.res.dto';

export class AdminMapper {
  public static toResponseDTO(user: AdminEntity): CarResDto {
    const awsConfig = ConfigStaticService.get().aws;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image ? `${awsConfig.bucketUrl}/${user.image}` : null,
    };
  }
}

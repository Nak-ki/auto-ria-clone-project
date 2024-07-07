import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { IUserData } from '../../../auth/interfaces/user-data.interface';
import { ContentType } from '../../../file-storage/models/enums/content-type.enum';
import { FileStorageService } from '../../../file-storage/services/file-storage.service';
import { LoggerService } from '../../../logger/logger.service';
import { AdminRepository } from '../../../repository/services/admin.repository';
// import { UpdateAdminReqDto } from '../dto/req/update-admin.req.dto';
import { CarResDto } from '../dto/res/car.res.dto';
import { AdminMapper } from './admin.mapper';

@Injectable()
export class AdminService {
  constructor(
    private readonly logger: LoggerService,
    private readonly adminRepository: AdminRepository,
    private readonly fileStorageService: FileStorageService,
  ) {}

  public async getMe(userData: IUserData): Promise<CarResDto> {
    const user = await this.adminRepository.findOneBy({ id: userData.userId });
    return AdminMapper.toResponseDTO(user);
  }

  // public async updateMe(
  //   userData: IUserData,
  //   updateUserDto: UpdateAdminReqDto,
  // ): Promise<CarResDto> {
  //   const user = await this.userRepository.findOneBy({ id: userData.userId });
  //   const updateUser = await this.userRepository.save({
  //     ...user,
  //     ...updateUserDto,
  //   });
  //   return AdminMapper.toResponseDTO(updateUser);
  // }

  public async removeMe(userData: IUserData): Promise<void> {
    const user = await this.adminRepository.findOneBy({ id: userData.userId });
    await this.adminRepository.remove(user);
  }

  public async getById(id: string): Promise<CarResDto> {
    const user = await this.adminRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return AdminMapper.toResponseDTO(user);
  }

  public async isEmailUniqueOrThrow(email: string): Promise<void> {
    const user = await this.adminRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException('Email is already taken');
    }
  }
  public async uploadAvatar(
    userData: IUserData,
    avatar: Express.Multer.File,
  ): Promise<void> {
    const image = await this.fileStorageService.uploadFile(
      avatar,
      ContentType.AVATAR,
      userData.userId,
    );
    await this.adminRepository.update(userData.userId, { image });
  }

  public async deleteAvatar(userData: IUserData): Promise<void> {
    const user = await this.adminRepository.findOneBy({ id: userData.userId });
    if (user.image) {
      await this.fileStorageService.deleteFile(user.image);
      await this.adminRepository.save(
        this.adminRepository.merge(user, { image: null }),
      );
    }
  }
}

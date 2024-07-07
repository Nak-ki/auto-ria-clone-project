import {
  Controller,
  Delete,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ApiFile } from '../../../common/decorators/api-file.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { CarResDto } from './dto/res/car.res.dto';
import { AdminService } from './services/admin.service';

@ApiTags('Admins')
@Controller('admins')
export class AdminController {
  constructor(private readonly userService: AdminService) {}

  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('me')
  public async getMe(@CurrentUser() userData: IUserData): Promise<CarResDto> {
    return await this.userService.getMe(userData);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiFile('avatar', false)
  @Post('me/avatar')
  public async uploadAvatar(
    @CurrentUser() userData: IUserData,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<void> {
    await this.userService.uploadAvatar(userData, avatar);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete('me/avatar')
  public async deleteAvatar(@CurrentUser() userData: IUserData): Promise<void> {
    await this.userService.deleteAvatar(userData);
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AdminRepository } from '../../repository/services/admin.repository';
import { ManagerRepository } from '../../repository/services/manager.repository';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { AdminService } from '../../roles-users/admin/services/admin.service';
import { ManagerService } from '../../roles-users/manager/services/manager.service';
import { UserService } from '../../roles-users/user/services/user.service';
import { SignInReqDto } from '../dto/req/sign-in.req.dto';
import { SignUpReqDto } from '../dto/req/sign-up.req.dto';
import {
  AuthResAdminDto,
  AuthResDto,
  AuthResManagerDto,
} from '../dto/res/auth.res.dto';
import { TokenPairResDto } from '../dto/res/token-pair.res.dto';
import { IUserData } from '../interfaces/user-data.interface';
import { AuthMapper } from './auth.mapper';
import { AuthCacheService } from './auth-cache.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
    private readonly managerService: ManagerService,
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly adminRepository: AdminRepository,
    private readonly managerRepository: ManagerRepository,
  ) {}

  public async singUp(dto: SignUpReqDto): Promise<AuthResDto> {
    await this.userService.isEmailUniqueOrThrow(dto.email);

    const password = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.save(
      this.userRepository.create({ ...dto, password }),
    );
    const pair = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: dto.deviceId,
      role: user.role,
    });
    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          user_id: user.id,
          refreshToken: pair.refreshToken,
          deviceId: dto.deviceId,
        }),
      ),
      this.authCacheService.saveToken(pair.accessToken, user.id, dto.deviceId),
    ]);
    return AuthMapper.toResponseDTO(user, pair);
  }

  public async singIn(dto: SignInReqDto): Promise<AuthResDto> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: { password: true, id: true, role: true },
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const pair = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: dto.deviceId,
      role: user.role,
    });

    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId: dto.deviceId,
        user_id: user.id,
      }),
      this.authCacheService.deleteToken(user.id, dto.deviceId),
    ]);

    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          user_id: user.id,
          refreshToken: pair.refreshToken,
          deviceId: dto.deviceId,
        }),
      ),
      this.authCacheService.saveToken(pair.accessToken, user.id, dto.deviceId),
    ]);
    const userEntity = await this.userRepository.findOneBy({ id: user.id });
    return AuthMapper.toResponseDTO(userEntity, pair);
  }
  public async refresh(userData: IUserData): Promise<TokenPairResDto> {
    const pair = await this.tokenService.generateAuthTokens({
      userId: userData.userId,
      deviceId: userData.deviceId,
      role: userData.role,
    });

    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId: userData.deviceId,
        user_id: userData.userId,
      }),
      this.authCacheService.deleteToken(userData.userId, userData.deviceId),
    ]);

    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          user_id: userData.userId,
          refreshToken: pair.refreshToken,
          deviceId: userData.deviceId,
        }),
      ),
      this.authCacheService.saveToken(
        pair.accessToken,
        userData.userId,
        userData.deviceId,
      ),
    ]);

    return AuthMapper.toResponseTokensDTO(pair);
  }

  public async signOut(userData: IUserData): Promise<void> {
    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId: userData.deviceId,
        user_id: userData.userId,
      }),
      this.authCacheService.deleteToken(userData.userId, userData.deviceId),
    ]);
  }

  public async singUpAdmin(dto: SignUpReqDto): Promise<AuthResAdminDto> {
    await this.adminService.isEmailUniqueOrThrow(dto.email);

    const password = await bcrypt.hash(dto.password, 10);
    const admin = await this.adminRepository.save(
      this.adminRepository.create({ ...dto, password }),
    );
    const pair = await this.tokenService.generateAuthTokens({
      userId: admin.id,
      deviceId: dto.deviceId,
      role: admin.role,
    });
    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          user_id: admin.id,
          refreshToken: pair.refreshToken,
          deviceId: dto.deviceId,
        }),
      ),
      this.authCacheService.saveToken(pair.accessToken, admin.id, dto.deviceId),
    ]);
    return AuthMapper.toResponseAdminDTO(admin, pair);
  }

  public async singInAdmin(dto: SignInReqDto): Promise<AuthResAdminDto> {
    const admin = await this.adminRepository.findOne({
      where: { email: dto.email },
      select: { password: true, id: true, role: true },
    });
    if (!admin) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(dto.password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const pair = await this.tokenService.generateAuthTokens({
      userId: admin.id,
      deviceId: dto.deviceId,
      role: admin.role,
    });

    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId: dto.deviceId,
        user_id: admin.id,
      }),
      this.authCacheService.deleteToken(admin.id, dto.deviceId),
    ]);

    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          user_id: admin.id,
          refreshToken: pair.refreshToken,
          deviceId: dto.deviceId,
        }),
      ),
      this.authCacheService.saveToken(pair.accessToken, admin.id, dto.deviceId),
    ]);
    const adminEntity = await this.adminRepository.findOneBy({ id: admin.id });
    return AuthMapper.toResponseAdminDTO(adminEntity, pair);
  }

  public async singUpManager(dto: SignUpReqDto): Promise<AuthResManagerDto> {
    await this.managerService.isEmailUniqueOrThrow(dto.email);

    const password = await bcrypt.hash(dto.password, 10);
    const manager = await this.managerRepository.save(
      this.managerRepository.create({ ...dto, password }),
    );
    const pair = await this.tokenService.generateAuthTokens({
      userId: manager.id,
      deviceId: dto.deviceId,
      role: manager.role,
    });
    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          user_id: manager.id,
          refreshToken: pair.refreshToken,
          deviceId: dto.deviceId,
        }),
      ),
      this.authCacheService.saveToken(
        pair.accessToken,
        manager.id,
        dto.deviceId,
      ),
    ]);
    return AuthMapper.toResponseManagerDTO(manager, pair);
  }

  public async singInManager(dto: SignInReqDto): Promise<AuthResManagerDto> {
    const manager = await this.managerRepository.findOne({
      where: { email: dto.email },
      select: { password: true, id: true, role: true },
    });
    if (!manager) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      manager.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const pair = await this.tokenService.generateAuthTokens({
      userId: manager.id,
      deviceId: dto.deviceId,
      role: manager.role,
    });

    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId: dto.deviceId,
        user_id: manager.id,
      }),
      this.authCacheService.deleteToken(manager.id, dto.deviceId),
    ]);

    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          user_id: manager.id,
          refreshToken: pair.refreshToken,
          deviceId: dto.deviceId,
        }),
      ),
      this.authCacheService.saveToken(
        pair.accessToken,
        manager.id,
        dto.deviceId,
      ),
    ]);
    const managerEntity = await this.adminRepository.findOneBy({
      id: manager.id,
    });
    return AuthMapper.toResponseManagerDTO(managerEntity, pair);
  }
}

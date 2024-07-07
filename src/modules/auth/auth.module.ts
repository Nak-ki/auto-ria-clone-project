import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { RedisModule } from '../redis/redis.module';
import { AdminModule } from '../roles-users/admin/admin.module';
import { ManagerModule } from '../roles-users/manager/manager.module';
import { UserModule } from '../roles-users/user/user.module';
import { AuthController } from './auth.controller';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { AuthService } from './services/auth.service';
import { AuthCacheService } from './services/auth-cache.service';
import { TokenService } from './services/token.service';

@Module({
  imports: [JwtModule, UserModule, RedisModule, AdminModule, ManagerModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    AuthCacheService,
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
    JwtAccessGuard,
  ],
  exports: [],
})
export class AuthModule {}

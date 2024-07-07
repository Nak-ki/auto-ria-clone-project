import { Global, Module } from '@nestjs/common';

import { AdminRepository } from './services/admin.repository';
import { CarRepository } from './services/car.repository';
import { ManagerRepository } from './services/manager.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';
import { UserRepository } from './services/user.repository';

@Global()
@Module({
  providers: [
    UserRepository,
    AdminRepository,
    ManagerRepository,
    RefreshTokenRepository,
    CarRepository,
  ],

  exports: [
    UserRepository,
    AdminRepository,
    ManagerRepository,
    RefreshTokenRepository,
    CarRepository,
  ],
})
export class RepositoryModule {}

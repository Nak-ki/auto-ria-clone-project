import { Module } from '@nestjs/common';

import { FileStorageModule } from '../../file-storage/file-storage.module';
import { AdminService } from './services/admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [FileStorageModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}

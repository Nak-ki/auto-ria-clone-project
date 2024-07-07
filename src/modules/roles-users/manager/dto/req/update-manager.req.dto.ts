import { PickType } from '@nestjs/swagger';

import { BaseAdminReqDto } from './base-admin.req.dto';

export class UpdateAdminReqDto extends PickType(BaseAdminReqDto, [
  'bio',
  'image',
  'name',
]) {}

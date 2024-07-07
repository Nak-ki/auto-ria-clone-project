import { PickType } from '@nestjs/swagger';

import { BaseCarResDto } from './base-car.res.dto';

export class AdminResDto extends PickType(BaseCarResDto, [
  'id',
  'name',
  'email',
  'image',
]) {}

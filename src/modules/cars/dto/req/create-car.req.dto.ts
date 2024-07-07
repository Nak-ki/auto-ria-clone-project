import { PickType } from '@nestjs/swagger';

import { BaseCarResDto } from './base-car.res.dto';

export class CarResDto extends PickType(BaseCarResDto, [
  'brand',
  'model',
  'price',
  'currency',
  'year',
  'region',
]) {}

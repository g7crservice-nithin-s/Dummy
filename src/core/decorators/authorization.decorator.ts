import { SetMetadata } from '@nestjs/common';
import { DecoratorConstant } from '../constants/decorator.constant';

export const Authorize = () => SetMetadata(DecoratorConstant.SECURED, true);

import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../enums/app-role.enum';
import { DecoratorConstant } from '../constants/decorator.constant';

export const HasRoles = (roles: RolesEnum[]) => SetMetadata(DecoratorConstant.HAS_ROLES, roles);

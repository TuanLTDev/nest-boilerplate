import { PickType } from '@nestjs/swagger';
import { CreateRoleDto } from '@modules/role/dto/create-role.dto';

export class AssignPermissionDto extends PickType(CreateRoleDto, ['permissions']) {}

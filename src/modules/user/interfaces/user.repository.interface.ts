import { User } from '@modules/user/entities/user.schema';
import { BaseRepositoryInterface } from '@database/repositories/base/base.interface.repository';

export interface UserRepositoryInterface extends BaseRepositoryInterface<User> {}

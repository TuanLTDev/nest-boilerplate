import { BaseRepositoryInterface } from '@database/repositories/base/base.interface.repository';
import { Session } from '@modules/session/entities/session.schema';

export interface SessionRepositoryInterface extends BaseRepositoryInterface<Session> {}

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepositoryAbstract } from '@database/repositories/base/base.abstract.repository';

import { Session, SessionDocument } from '@modules/session/entities/session.schema';
import { SessionRepositoryInterface } from '@modules/session/interfaces/session.repository.interface';

export class SessionRepository extends BaseRepositoryAbstract<SessionDocument> implements SessionRepositoryInterface {
  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
  ) {
    super(sessionModel);
  }
}

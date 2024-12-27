import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { SessionRepositoryInterface } from '@modules/session/interfaces/session.repository.interface';
import { CreateSessionDto } from '@modules/session/dto/create-session.dto';
import { Session } from '@modules/session/entities/session.schema';

@Injectable()
export class SessionService {
  constructor(
    @Inject('SessionRepositoryInterface')
    private readonly repository: SessionRepositoryInterface,
  ) {}

  async create(dto: CreateSessionDto) {
    return this.repository.create(dto);
  }

  async findOneById(id: string) {
    return this.repository.findOneById(id, { lean: true });
  }

  async findOneByCondition(condition: FilterQuery<Session>) {
    return this.repository.findOneByCondition(condition, { lean: true });
  }

  async findByIdAndUpdate(id: string, dto: Partial<Session>) {
    return this.repository.findByIdAndUpdate(id, dto, { lean: true, new: true });
  }

  async removeToken(id: string): Promise<boolean> {
    return this.repository.softDelete(id);
  }

  async revokeToken(userId: string, sessionId?: string) {
    const condition = {
      userId: userId,
      _id: sessionId ?? { $ne: sessionId },
    };
    await this.repository.deleteMany(condition);
  }
}

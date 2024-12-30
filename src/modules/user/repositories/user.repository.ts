import { User, UserDocument } from '@modules/user/entities/user.schema';
import { UserRepositoryInterface } from '@modules/user/interfaces/user.repository.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from '@database/repositories/base/base.abstract.repository';

@Injectable()
export class UserRepository extends BaseRepositoryAbstract<UserDocument> implements UserRepositoryInterface {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }
}

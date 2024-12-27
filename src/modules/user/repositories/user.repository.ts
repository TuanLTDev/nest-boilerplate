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

  async findAllUserWithShopAssigned() {
    const projection = {
      email: 1,
      firstName: 1,
      lastName: 1,
      displayName: 1,
      gender: 1,
      dateOfBirth: 1,
      avatarUrl: 1,
      coverImageUrl: 1,
      phoneNumber: 1,
      address: 1,
      createdAt: 1,
      role: { $arrayElemAt: ['$role', 0] },
      shopsAssigned: {
        $map: {
          input: '$shopsAssigned',
          as: 'shopAssigned',
          in: '$$shopAssigned.shop',
        },
      },
    };
    const users = await this.userModel.aggregate([
      { $match: { deletedAt: null } },
      {
        $lookup: {
          from: 'Roles',
          localField: 'role',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, name: 1 } }],
          as: 'role',
        },
      },
      {
        $lookup: {
          from: 'UserShops',
          localField: '_id',
          foreignField: 'user',
          as: 'shopsAssigned',
          pipeline: [
            {
              $project: {
                _id: 0,
                shop: 1,
              },
            },
          ],
        },
      },
      {
        $project: projection,
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return users;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@modules/user/entities/user.schema';
import { Model } from 'mongoose';
import { AxiosClientService } from '@shared/services/axios-client.service';
import { ConfigService } from '@nestjs/config';
import { GENDER } from '@core/constants/user.constant';
import { hashPassword } from '@core/utils/password.util';
import { Role, RoleDocument } from '@modules/role/entities/role.schema';

import { ROLE } from '@core/constants/app.constant';

type UserApiResponse = {
  id: number;
  full_name: string;
  position: string;
  department: string;
  gender: GENDER;
  birth_of_date?: string;
  email?: string;
  phone_number?: string;
};

@Injectable()
export class UserSeedService {
  private axiosClientService: AxiosClientService;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    private readonly configService: ConfigService,
  ) {
    const accessToken = this.configService.getOrThrow<string>('app.admobAccessToken', { infer: true });
    this.axiosClientService = new AxiosClientService({
      baseURL: this.configService.getOrThrow<string>('app.admobUrl'),
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  async run() {
    const count = await this.userModel.countDocuments();
    const adminRole: Role = await this.roleModel.findOne({ name: ROLE.ADMIN }).lean().exec();
    const moderatorRole: Role = await this.roleModel.findOne({ name: ROLE.MODERATOR }).lean().exec();
    const basicRole: Role = await this.roleModel.findOne({ name: ROLE.USER }).lean().exec();

    if (count === 0) {
      const DEFAULT_PASSWORD = await hashPassword(`lutech@${new Date().getFullYear()}`);
      const usersSeedData: Array<Partial<User>> = [
        {
          email: 'admin@lutech.ltd',
          password: DEFAULT_PASSWORD,
          gender: GENDER.MALE,
          displayName: 'Admin',
          role: adminRole._id.toString(),
        },
        {
          email: 'nguyenluan@lutech.ltd',
          password: DEFAULT_PASSWORD,
          gender: GENDER.MALE,
          displayName: 'Nguyen Luan',
          role: adminRole._id.toString(),
        },
        {
          email: 'nguyenlinh@lutech.ltd',
          password: DEFAULT_PASSWORD,
          gender: GENDER.FEMALE,
          displayName: 'Nguyen Linh',
          role: adminRole._id.toString(),
        },
        {
          email: 'moderator@lutech.ltd',
          password: DEFAULT_PASSWORD,
          gender: GENDER.FEMALE,
          displayName: 'Moderator',
          role: moderatorRole._id.toString(),
        },
      ];

      const listMailAlready = usersSeedData.map((item) => item.email);
      const response: any = await this.axiosClientService.get('office/employee', {
        params: {
          department: 'Accounter',
        },
      });
      const usersResponseData: Array<Partial<UserApiResponse>> = [];
      if (response && response.success) {
        usersResponseData.push(...response.data);

        let users: Array<Partial<User>> = usersResponseData.map((user) => {
          if (user?.email && !listMailAlready.includes(user?.email)) {
            return {
              email: user.email,
              password: DEFAULT_PASSWORD,
              gender: user.gender,
              displayName: user.full_name,
              dateOfBirth: new Date(user.birth_of_date),
              phoneNumber: user.phone_number ?? undefined,
              role: basicRole._id.toString(),
            };
          }
        });

        users = users.filter((user) => user !== undefined);
        usersSeedData.push(...users);

        const operations = usersSeedData.map((user: Partial<User>) => {
          return {
            updateOne: {
              filter: { email: user.email },
              update: { $set: user },
              upsert: true,
            },
          };
        });

        await this.userModel.bulkWrite(operations).then(() => {
          console.log('Seeded data for users model: ', usersSeedData.length, ' record');
        });
      }
    }
  }
}

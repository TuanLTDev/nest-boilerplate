import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class AppService {
  getHello(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}

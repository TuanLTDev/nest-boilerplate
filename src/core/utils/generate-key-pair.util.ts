import { KeyPair } from '@common/types';
import * as crypto from 'crypto';

export function generateKeyPair(): KeyPair {
  return {
    privateKey: crypto.randomBytes(64).toString('hex'),
    publicKey: crypto.randomBytes(64).toString('hex'),
  };
}

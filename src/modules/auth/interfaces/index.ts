import { AcceptHeader, IpAddress, UserAgent } from 'nestjs-fingerprint/dist/type';

export interface DeviceMetadata {
  id: string;
  headers: AcceptHeader;
  userAgent: UserAgent;
  ipAddress: IpAddress;
}

export interface ICurrentUser {
  userId: string;
  sessionId: string;
  role: string;
  permissions?: string[];
}

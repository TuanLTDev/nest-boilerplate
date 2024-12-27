export type JwtAccessPayloadType = {
  userId: string;
  sessionId: string;
  role: string;
  permissions?: string[];
  iat?: number;
  exp?: number;
};

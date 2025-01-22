export const MONGOOSE_ID_OBJECT_FORMAT = /^[0-9a-fA-F]{24}$/;
export const IS_PUBLIC = 'isPublic';
export const IS_AUTH_OPTIONAL = 'isAuthOptional';
export const DEFAULT_PASSWORD = `lutech@${new Date().getFullYear()}`;

export enum Environment {
  LOCAL = 'local',
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TEST = 'test',
}

export enum LogService {
  CONSOLE = 'console',
  GOOGLE_LOGGING = 'google_logging',
  AWS_CLOUDWATCH = 'aws_cloudwatch',
}

// Redact value of these paths from logs
export const loggingRedactPaths = [
  'req.headers.authorization',
  'req.body.token',
  'req.body.refreshToken',
  'req.body.email',
  'req.body.password',
  'req.body.oldPassword',
];

export enum ResourceList {
  USER = 'user',
  ROLE = 'role',
  PERMISSION = 'permission',
}

export enum ActionList {
  CREATE = 'create',
  READ = 'read',
  READ_ALL = 'readAll',
  UPDATE = 'update',
  UPDATE_ANY = 'updateAny',
  DELETE = 'delete',
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 50;

export enum ROLE {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  USER = 'USER',
}

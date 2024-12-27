import { applyDecorators, HttpCode, HttpStatus, Type } from '@nestjs/common';
import { STATUS_CODES } from 'http';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { ErrorDto } from '@common/dto/error.dto';
import { Public } from '@core/decorators/public.decorator';
import { ApiPaginatedResponse } from '@core/decorators/swagger.decorators';
import { Roles } from '@core/decorators/role.decorator';
import { PermissionPayload } from '@config/permission.config';
import { PermissionHandler } from '@core/utils/permission-handler';
import { CheckPermissions } from '@core/decorators/permission.decorator';
import { ActionList, ResourceList, ROLE } from '@core/constants/app.constant';

type ApiResponseType = number;
type ApiAuthType = 'basic' | 'api-key' | 'jwt';
type PaginationType = 'offset' | 'cursor';

interface IApiOptions<T extends Type<any>> {
  type?: T;
  summary?: string;
  description?: string;
  errorResponses?: ApiResponseType[];
  statusCode?: HttpStatus;
  isPaginated?: boolean;
  isArray?: boolean;
  paginationType?: PaginationType;
}

type IApiPublicOptions = IApiOptions<Type<any>>;

interface IApiAuthOptions extends IApiOptions<Type<any>> {
  auths?: ApiAuthType[];
  roles?: ROLE[];
  permissions?: PermissionPayload[];
}

export const ApiPublic = (options: IApiPublicOptions = {}): MethodDecorator => {
  const defaultStatusCode = HttpStatus.OK;
  const defaultErrorResponses = [
    HttpStatus.BAD_REQUEST,
    HttpStatus.FORBIDDEN,
    HttpStatus.NOT_FOUND,
    HttpStatus.UNPROCESSABLE_ENTITY,
    HttpStatus.INTERNAL_SERVER_ERROR,
  ];
  const isPaginated = options.isPaginated || false;
  const ok = {
    type: options.type,
    description: options?.description ?? 'OK',
    isArray: options.isArray ?? false,
    paginationType: options.paginationType || 'offset',
  };

  const errorResponses = (options.errorResponses || defaultErrorResponses)?.map((statusCode) =>
    ApiResponse({
      status: statusCode,
      type: ErrorDto,
      description: STATUS_CODES[statusCode],
    }),
  );

  return applyDecorators(
    Public(),
    ApiOperation({ summary: options?.summary }),
    HttpCode(options.statusCode || defaultStatusCode),
    isPaginated ? ApiPaginatedResponse(ok) : ApiOkResponse(ok),
    ...errorResponses,
  );
};

export const ApiAuth = (options: IApiAuthOptions = {}): MethodDecorator => {
  const defaultStatusCode = HttpStatus.OK;
  const defaultErrorResponses = [
    HttpStatus.BAD_REQUEST,
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
    HttpStatus.NOT_FOUND,
    HttpStatus.UNPROCESSABLE_ENTITY,
    HttpStatus.INTERNAL_SERVER_ERROR,
  ];
  const isPaginated = options.isPaginated || false;
  const ok = {
    type: options.type,
    description: options?.description ?? 'OK',
    isArray: options.isArray ?? false,
    paginationType: options.paginationType || 'offset',
  };
  const auths = options.auths || ['jwt'];
  const roles: ROLE[] = options?.roles || [ROLE.USER];

  const errorResponses = (options.errorResponses || defaultErrorResponses)?.map((statusCode) =>
    ApiResponse({
      status: statusCode,
      type: ErrorDto,
      description: STATUS_CODES[statusCode],
    }),
  );

  const authDecorators = auths.map((auth) => {
    switch (auth) {
      case 'basic':
        return ApiBasicAuth();
      case 'api-key':
        return ApiSecurity('Api-Key');
      case 'jwt':
        return ApiBearerAuth();
    }
  });

  const permissions: PermissionPayload[] = options?.permissions ?? [
    { resource: ResourceList.USER, actions: [ActionList.READ, ActionList.UPDATE] },
  ];
  const permissionHandlers = permissions.map((permission) => new PermissionHandler(permission));

  return applyDecorators(
    ApiOperation({ summary: options?.summary }),
    HttpCode(options.statusCode || defaultStatusCode),
    Roles(...roles),
    CheckPermissions(...permissionHandlers),
    isPaginated ? ApiPaginatedResponse(ok) : options.statusCode === 201 ? ApiCreatedResponse(ok) : ApiOkResponse(ok),
    ...authDecorators,
    ...errorResponses,
  );
};

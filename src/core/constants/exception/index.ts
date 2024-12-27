import { AUTH_ERROR_CODE, AUTH_ERROR_RES } from '@core/constants/exception/authentication.code';
import { PERMISSION_CODE, PERMISSION_ERROR_RES } from '@core/constants/exception/permission.code';

export const ERROR_CODE = {
  ...AUTH_ERROR_CODE,
  ...PERMISSION_CODE,
};

export const ERROR_RES = {
  ...AUTH_ERROR_RES,
  ...PERMISSION_ERROR_RES,
};

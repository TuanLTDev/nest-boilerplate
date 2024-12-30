import * as process from 'process';
import { ROLE } from '@core/constants/app.constant';

export const getEnvFilePath = (): string => {
  const ENV = process.env.NODE_ENV;
  if (ENV === 'development') return '.env.development';
  if (ENV === 'production') return '.env.production';
  return '.env';
};

export const convertCamelToSnake = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map((item) => convertCamelToSnake(item));
  } else if (data instanceof Date) {
    return data;
  } else if (data !== null && typeof data === 'object') {
    const newObj = {};
    Object.keys(data).forEach((key) => {
      const snakeKey = camelToSnake(key);
      newObj[snakeKey] = convertCamelToSnake(data[key]);
    });
    return newObj;
  }
  return data;
};

export const camelToSnake = (key: string): string => {
  return key.replace(/([A-Z])/g, '_$1').toLowerCase();
};

export const renameKeys = (obj: object, keyMapping: { [key: string]: string }) => {
  return obj
    ? Object.keys(obj).reduce((acc, key) => {
        const newKey = keyMapping[key] || key;
        acc[newKey] = obj[key];
        return acc;
      }, {})
    : null;
};

export const isCoreRoleSystem = (role: string) => {
  return Object.values(ROLE).includes(role as unknown as ROLE);
};

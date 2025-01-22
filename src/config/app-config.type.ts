export type AppConfig = {
  nodeEnv: string;
  name: string;
  url: string;
  clientUrl: string;
  port: number;
  debug: boolean;
  apiPrefix: string;
  corsOrigin: boolean | string | RegExp | (string | RegExp)[];
  admobUrl: string;
  admobAccessToken: string;
};

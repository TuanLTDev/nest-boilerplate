export type DatabaseConfig = {
  scheme: string;
  host: string;
  username: string;
  password: string;
  port: number;
  databaseName: string;
  options?: string;
};

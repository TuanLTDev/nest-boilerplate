export interface BaseTokenPayload {
  id: string;
}

export type Token = {
  accessToken: string;
  refreshToken: string;
};

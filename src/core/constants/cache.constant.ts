export enum CacheKey {
  SESSION_BLACKLIST = 'auth:session-blacklist:%s', // %s: sessionId
  EMAIL_VERIFICATION = 'auth:token:%s:email-verification', // %s: userId
  PASSWORD_RESET = 'auth:token:%s:password', // %s: userId
  SECRET_KEY_ACCESS_TOKEN = 'auth:token:%s:access-token', // %s: sessionId (sessionId)
  SECRET_KEY_REFRESH_TOKEN = 'auth:token:%s:refresh-token', // %s: sessionId (sessionId)
}

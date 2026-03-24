import { AuthConfig } from '@auth0/auth0-angular';

export const authConfig: AuthConfig = {
  domain: 'dev-codekittey.eu.auth0.com',
  clientId: 'PqrUSlrGpMGqBFK9NbjHWZBej8yV8oNY',
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: 'http://localhost:3010',
    scope: 'openid profile email users:read users:write',
  },
  useRefreshTokens: true,
  httpInterceptor: {
    allowedList: [
      'http://localhost:3000/api/*',
    ],
  },
};

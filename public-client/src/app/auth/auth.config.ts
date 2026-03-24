import { AuthConfig } from '@auth0/auth0-angular';

export const authConfig: AuthConfig = {
  domain: 'DEINE-AUTH0-DOMAIN.auth0.com',
  clientId: 'DEINE-CLIENT-ID',
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

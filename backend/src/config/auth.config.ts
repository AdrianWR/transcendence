import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  backend_url: process.env.BACKEND_URL || 'http://localhost:8080',
  frontend_url: process.env.FRONTEND_URL || 'http://localhost:3000',
  google: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    secret: process.env.GOOGLE_SECRET,
    redirect_url: process.env.GOOGLE_REDIRECT_URL,
  },
  intra: {
    uid: process.env.INTRA_CLIENT_ID,
    secret: process.env.INTRA_SECRET,
    redirect_url: process.env.INTRA_REDIRECT_URL,
  },
  jwt: {
    access: {
      secret: process.env.JWT_ACCESS_SECRET,
      expires_in: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    },
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET,
      expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
  },
  twoFactor: {
    appName: process.env.TWO_FACTOR_AUTH_APP_NAME || 'Transcendence 2FA',
  },
}));

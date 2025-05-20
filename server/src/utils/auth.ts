import { Response } from 'express';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 3600000, // 1 hour
  path: '/'
};

export const setAuthCookies = (res: Response, tokens: { accessToken: string; idToken: string; refreshToken: string }) => {
  res.cookie('accessToken', tokens.accessToken, COOKIE_OPTIONS);
  res.cookie('idToken', tokens.idToken, COOKIE_OPTIONS);
  res.cookie('refreshToken', tokens.refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 30 * 24 * 3600000 // 30 days
  });
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('idToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/' });
}; 
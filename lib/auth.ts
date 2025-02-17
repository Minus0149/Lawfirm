import { setCookie, getCookie, deleteCookie } from 'cookies-next';

export const setAuthCookie = (token: string) => {
  setCookie('auth_token', token, {
    maxAge: 10 * 24 * 60 * 60, // 30 days
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};

export const getAuthCookie = () => {
  return getCookie('auth_token');
};

export const removeAuthCookie = () => {
  deleteCookie('auth_token');
};


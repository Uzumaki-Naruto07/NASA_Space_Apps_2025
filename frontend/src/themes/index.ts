import type { Theme } from '../types';

export const lightTheme: Theme = {
  mode: 'light',
  primary: '#3b82f6',
  secondary: '#1e40af',
  background: '#f0f9ff',
  surface: '#ffffff',
  text: '#1e293b',
  accent: '#66fcf1',
};

export const darkTheme: Theme = {
  mode: 'dark',
  primary: '#66fcf1',
  secondary: '#c5c6c7',
  background: '#0b0c10',
  surface: '#1f2833',
  text: '#ffffff',
  accent: '#66fcf1',
};

export const getTheme = (mode: 'light' | 'dark'): Theme => {
  return mode === 'light' ? lightTheme : darkTheme;
};

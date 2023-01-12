import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  port: process.env.PORT ?? 5000,
  isDevelopment: process.env.NODE_ENV === 'development',
  isBuild: (process.env.NODE_ENV as any) === 'build',
}));
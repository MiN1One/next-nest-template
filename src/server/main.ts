import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import appConfig from './app.config';
import { ConfigType } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { ViewModule } from './modules/view.module';
import { ViewService } from './modules/view.service';
import NextServer from 'next';
import { NextServer as NextServerType } from 'next/dist/server/next';
import { exec } from 'child_process';
import { promisify } from 'util';

declare const module: any;

async function bootstrap() {
  const adapter = new FastifyAdapter();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter
  );

  const {
    port,
    isDevelopment,
    isBuild,
  } = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);

  let nextServer: NextServerType;

  if (!isBuild) {
    nextServer = NextServer({
      dev: isDevelopment,
      dir: 'src/client',
    });

    app.select(ViewModule).get(ViewService).setNextServer(
      nextServer, 
      !module?.hot?.data?.nextServer
    );
  }

  await app.listen(port, '::');

  if (isBuild) {
    try {
      await promisify(exec)('yarn build:client');
      await app.close();
      process.exit(0);
    } catch {
      process.exit(1);
    }
  }

  Logger.log(
    `App running on ${process.env.NODE_ENV.toUpperCase()} mode @ port ${port}`,
    'Bootstrap'
  );

  if (!isBuild && module.hot) {
    module.hot.accept();
    module.hot.dispose((data: any) => {
      data.nextServer = nextServer;
      app.close();
    });
  }
}

bootstrap();
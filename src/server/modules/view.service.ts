import { Injectable, Logger } from '@nestjs/common';
import { NextServer } from 'next/dist/server/next';
import { parse } from 'url';
import { FastifyReply, FastifyRequest } from "fastify";

@Injectable()
export class ViewService {
  nextServer: NextServer;

  async setNextServer(server: NextServer, prepare?: boolean) {
    try {
      this.nextServer = server;

      if (prepare) {
        await this.nextServer.prepare();
      }
    } catch (er) {
      Logger.error(er, 'ViewService:setNextServer');
    }
  }

  getHandler(req: FastifyRequest, res: FastifyReply) {
    const parsedUrl = parse(req.url, true);
    this.nextServer.getRequestHandler()(req.raw, res.raw, parsedUrl);
  }
}
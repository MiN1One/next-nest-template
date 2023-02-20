import { Injectable, Logger } from '@nestjs/common';
import { NextServer, RequestHandler } from 'next/dist/server/next';
import { FastifyReply, FastifyRequest } from "fastify";
import { parse, UrlWithParsedQuery } from 'url';
import * as localesConfig from '../../../../locales';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';

interface IParsedQueryWithNextQuery extends UrlWithParsedQuery {
  query: UrlWithParsedQuery['query'] & NextParsedUrlQuery;
}

@Injectable()
export class ViewService {
  nextServer: NextServer;
  nextHandler: RequestHandler;

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

  getNextQuery(req: FastifyRequestWithLocale) {
    const { params: { locale }, url } = req;
    const { locales, defaultLocale } = localesConfig;
    const parsedUrl: IParsedQueryWithNextQuery = parse(url, true);

    let pathname = parsedUrl.path.toLowerCase();
    let parsedLocale: string;
    if (locale && locales.includes(locale.toLowerCase())) {
      parsedLocale = locale;
      pathname = pathname.replace(locale.toLowerCase(), '');
    }

    parsedUrl.query = {
      ...parsedUrl.query,
      __nextLocale: parsedLocale || defaultLocale,
      __nextDefaultLocale: defaultLocale,
    };
    parsedUrl.pathname = pathname;
    
    return parsedUrl;
  }

  async renderPage(req: FastifyRequest, res: FastifyReply) {
    const parsedUrl = this.getNextQuery(req);
    try {
      return this.nextServer.render(
        req.raw, 
        res.raw,
        parsedUrl.pathname,
        parsedUrl.query,
        parsedUrl
      )
    } catch (er) {
      Logger.error(er, 'ViewService:renderPage');
      return this.nextServer.renderError(
        er, 
        req.raw, 
        res.raw,
        parsedUrl.pathname,
        parsedUrl.query
      );
    }
  }

  setNextHandler() {
    this.nextHandler = this.nextServer.getRequestHandler();
  }

  getHandler(req: FastifyRequest, res: FastifyReply) {
    return this.nextHandler(req.raw, res.raw);
  }
}
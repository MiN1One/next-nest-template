import { FastifyRequest } from "fastify";

interface IFastifyRequest<T extends Object> extends FastifyRequest {
  params: FastifyRequest['params'] & T;
}

declare global {
  interface FastifyRequestWithLocale extends IFastifyRequest<{
    locale?: string;
  }> {}
}
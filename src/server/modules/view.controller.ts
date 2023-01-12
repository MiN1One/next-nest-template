import { Controller, Get, Req, Res } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import { parse } from "url";
import { ViewService } from "./view.service";

@Controller()
export class ViewController {
  constructor(
    readonly viewService: ViewService,
  ) {}

  @Get('*')
  renderView(
    @Req() req: FastifyRequest, 
    @Res() res: FastifyReply,
  ) {
    const parsedUrl = parse(req.url, true);
    return this.viewService.nextServer.render(
      req.raw, 
      res.raw, 
      parsedUrl.pathname, 
      parsedUrl.query, 
      parsedUrl
    );
  }
}
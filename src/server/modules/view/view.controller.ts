import { Controller, Get, Req, Res } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import { ViewService } from "./view.service";

@Controller()
export class ViewController {
  constructor(
    readonly viewService: ViewService,
  ) {}

  @Get(['*', '/_next/']) 
  serveNextAssets(
    @Res() res: FastifyReply,
    @Req() req: FastifyRequest,
  ) {
    return this.viewService.nextHandler(req.raw, res.raw);
  }

  @Get('/:locale/')
  renderView(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
  ) {
    return this.viewService.renderPage(req, res);
  }
}
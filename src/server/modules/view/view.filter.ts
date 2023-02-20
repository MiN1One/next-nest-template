import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from "@nestjs/common";
import { ViewService } from "./view.service";

@Catch(NotFoundException)
export class ViewFilter implements ExceptionFilter {
  constructor(
    readonly viewService: ViewService,
  ) {}

  catch(_exception: NotFoundException, host: ArgumentsHost) {
    const req = host.switchToHttp().getRequest();
    const res = host.switchToHttp().getResponse();
    this.viewService.getHandler(req, res);
  }
}
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('test')
  getData() {
    return 'Hello from server!';
  }
}

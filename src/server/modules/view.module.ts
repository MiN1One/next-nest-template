import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { ViewController } from "./view.controller";
import { ViewFilter } from "./view.filter";
import { ViewService } from "./view.service";

@Module({
  controllers: [ViewController],
  providers: [
    ViewService,
    {
      useClass: ViewFilter,
      provide: APP_FILTER
    }
  ],
})
export class ViewModule {}
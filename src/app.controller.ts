import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { BodyDto } from './body.dto';

@Controller('sample')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('post')
  async createReply(@Body() body: BodyDto) {
    return await this.appService.postNew(body);
  }
}

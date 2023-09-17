import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { BodyDto } from './body.dto';

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('post')
  async createReply(@Body() body: any) {
    return await this.appService.postNew(body);
  }

  @Get('getreview')
  async getReview() {
    return await this.appService.getReview();
  }

  @Get('groupReviews/:id')
  groupReviews(@Param('id') product_id: string) {
    return this.appService.groupReviews(product_id);
  }
}

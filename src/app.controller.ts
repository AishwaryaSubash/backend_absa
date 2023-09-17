import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AddReview, BodyDto } from './body.dto';

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
  async groupReviews(@Param('id') product_id: string) {
    return await this.appService.groupReviews(product_id);
  }

  @Post('addReview')
  async addReview(@Body() body: AddReview){
    return await this.appService.addReview(body)
  }

}

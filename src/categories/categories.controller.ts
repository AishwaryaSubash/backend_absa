import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryFetch } from './dto/categ.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('findAllCategories')
  async findAllCategories() {
    return await this.categoriesService.findAllCategories();
  }

  @Post('findAllProducts')
  async findAllProducts(@Body() body: CategoryFetch) {
    return await this.categoriesService.findAllProducts(body);
  }
}

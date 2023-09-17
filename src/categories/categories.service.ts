import { Get, Injectable, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryFetch } from './dto/categ.dto';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  async findAllCategories() {
    return await this.prismaService.productReview.groupBy({
      by: ['product_categry'],
    });
  }

  async findAllProducts(body: CategoryFetch) {
    return await this.prismaService.productReview.groupBy({
      by: ['product_id', 'product_title'],
      where: {
        product_categry: body.categName,
      },
    });
  }
}

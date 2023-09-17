import { Get, Injectable, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  async findAllCategories() {
    return await this.prismaService.productReview.findMany();
  }
}
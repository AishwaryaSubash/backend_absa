import { Get, Injectable, Post } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { BodyDto } from './body.dto';

@Injectable()
export class AppService {
  constructor(private prismaClient: PrismaClient) {}

  @Post()
  postNew(body: BodyDto) {
    this.prismaClient.productReview.create({
      data: {
        product_id: 'ACCFZGAQJGYCYDCM',
        product_title:
          'BoAt Rockerz 235v2 with ASAP charging Version 5.0 Bluetooth Headset',
        product_categry: 'Electronics',
        rating: 4,
        review: '',
        summary: '',
      },
    });
  }
}

// product_id      String
//   id              String       @id @default(auto()) @map("_id") @db.ObjectId
//   product_title   String
//   product_categry String
//   rating          Int
//   summary         String
//   review          String
//   date            DateTime     @d

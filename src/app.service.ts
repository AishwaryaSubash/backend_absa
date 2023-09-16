import { Get, Injectable, Post } from '@nestjs/common';
import { BodyDto } from './body.dto';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prismaClient: PrismaService) {}

  async postNew(body: BodyDto) {
    console.log(body);
    await this.prismaClient.productReview.create({
      data: {
        product_id: body.product_id,
        product_categry: body.product_category,
        product_title: body.product_title,
        rating: body.rating,
        review: body.review,
        summary: body.summary,
        date: body.date,
        predictions: {
          create: {
            aspect_terms: body.aspect_terms_sentiment.map(
              (item) => item.aspect_term,
            ),
            aspect_sentiment_polarities: body.aspect_terms_sentiment.map(
              (item) => item.sentiment_polarity,
            ),
            overall_sentiment_polarities: body.overall_sentiment_polarity.label,
          },
        },
      },
    });
  }

  async getReview() {
    const data = await this.prismaClient.productReview.findMany({
      select: {
        id: true,
        date: true,
        predictions: true,
        product_categry: true,
        product_id: true,
        product_title: true,
        rating: true,
        review: true,
        summary: true,
      },
      orderBy: {
        rating: 'desc',
      },
    });

    return data;
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

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
  async groupReviews(product_id: string){
    try {
      const res = await this.prismaClient.productReview.groupBy({
        by: ['review', 'summary', 'date', 'id'],
        where: {
          product_id: product_id,
        },
        orderBy: {
          date: 'desc',
        },
      });
      const det = await this.prismaClient.productReview.findFirst({
        where: {
          product_id: product_id,
        },
        select: {
          product_title: true,
          product_categry: true,
          rating: true,
        },
      });
      const predictions = await this.prismaClient.predictions.findMany({
        where: {
          product_review: {
            product_id: product_id,
          },
        },
        select: {
          aspect_sentiment_polarities: true,
          aspect_terms: true,
          overall_sentiment_polarities: true,
          pred_id: true,
          product_review: true,
        },
      });

      const combinedData = {
        reviews: res,
        predictions: predictions,
        details: det,
      };
      return combinedData;
    } catch (error) {
      console.log('error');
    }
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

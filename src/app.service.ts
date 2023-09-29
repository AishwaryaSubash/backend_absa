import { Get, Injectable, Post } from '@nestjs/common';
import { AddReview, BodyDto } from './body.dto';
import { PrismaService } from './prisma/prisma.service';
import axios from 'axios';

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

    return await this.groupReviews(body.product_id);
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
  async groupReviews(product_id: string) {
    try {
      // const res = await this.prismaClient.productReview.groupBy({
      //   by: ['review', 'summary', 'date', 'id'],
      //   where: {
      //     product_id: product_id,
      //   },
      //   orderBy: {
      //     date: 'desc',
      //   },
      // });
      const det = await this.prismaClient.productReview.findFirst({
        where: {
          product_id: product_id,
        },
        select: {
          product_title: true,
          product_categry: true,
          rating: true,
          product_id: true,
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
          product_review: {
            select: {
              review: true,
              summary: true,
              date: true,
              id: true,
            },
          },
        },
      });

      const combinedData = {
        // reviews: res,
        predictions: predictions,
        details: det,
      };
      return predictions[0];
    } catch (error) {
      console.log('error');
    }
  }

  async addReview(body: AddReview) {
    console.log(body);
    const options: {
      year: 'numeric';
      month: 'short';
      day: 'numeric';
    } = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    const today = new Date();
    const date = today.toLocaleDateString('en-US', options);
    console.log(date);
    const data = await axios
      .post('https://733e-35-233-223-26.ngrok-free.app/generate', {
        inputs: body.review,
        parameters: {},
      })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log(data);
    const aspect_terms_sentiment = JSON.parse(data['generated_text']);
    const overall_sentiment_polarity = JSON.parse(
      data['overall_sentiment_polarity'],
    )[0];
    await this.prismaClient.productReview.create({
      data: {
        product_id: body.product_id,
        product_categry: body.product_category,
        product_title: body.product_title,
        rating: 0,
        review: body.review,
        summary: body.summary,
        date: date,
        predictions: {
          create: {
            aspect_terms: aspect_terms_sentiment.map(
              (item: { aspect_term: any }) => item.aspect_term,
            ),
            aspect_sentiment_polarities: aspect_terms_sentiment.map(
              (item: { sentiment_polarity: any }) => item.sentiment_polarity,
            ),
            overall_sentiment_polarities: overall_sentiment_polarity.label,
          },
        },
      },
    });
    return await this.groupReviews(body.product_id);
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

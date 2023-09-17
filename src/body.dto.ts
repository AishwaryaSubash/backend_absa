export class BodyDto {
  product_id: string;
  product_title: string;
  product_category: string;
  rating: number;
  review: string;
  summary: string;
  date: string;
  aspect_terms_sentiment: { aspect_term: string; sentiment_polarity: string }[];
  overall_sentiment_polarity: { label: string; score: number };
}


export class AddReview {
  product_id: string;
  product_title: string;
  product_category: string;
  review: string;
  summary: string;
}
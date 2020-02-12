import { Injectable } from "@angular/core";
import { PROMOTIONS } from "../shared/promotions";
import { Promotion } from "../shared/promotion";

@Injectable({
  providedIn: "root"
})
export class PromotionService {
  constructor() {}

  getPromotions(): Promise<Promotion[]> {
    return Promise.resolve(PROMOTIONS);
  }

  getPromotion(id: string): Promise<Promotion> {
    return Promise.resolve(
      PROMOTIONS.filter(promotion => promotion.id === id)[0]
    );
  }

  getFeaturedPromotion(): Promise<Promotion> {
    return Promise.resolve(
      PROMOTIONS.filter(promotion => promotion.featured)[0]
    );
  }
}

import { Component, OnInit, Inject } from "@angular/core";
import { DishService } from "../services/dish.service";
import { PromotionService } from "../services/promotion.service";
import { Dish } from "../shared/dish";
import { Promotion } from "../shared/promotion";
import { LeaderService } from "../services/leader.service";
import { Leader } from "../shared/leader";
import { flyInOut, expand } from "../animations/app-animation";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  host: {
    "[@flyInOut]": "true",
    style: "display: block;"
  },
  animations: [flyInOut(), expand()]
})
export class HomeComponent implements OnInit {
  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  dishErrMessage: string;
  promotionErrMessage: string;
  leaderErrMessage: string;

  constructor(
    private dishService: DishService,
    private promService: PromotionService,
    private leaderService: LeaderService,
    @Inject("BaseURL") private BaseURL
  ) {}

  ngOnInit() {
    this.dishService.getFeaturedDish().subscribe(
      dish => (this.dish = dish),
      errMessage => (this.dishErrMessage = <any>errMessage)
    );
    this.promService.getFeaturedPromotion().subscribe(
      promotion => (this.promotion = promotion),
      errMessage => (this.promotionErrMessage = <any>errMessage)
    );
    this.leaderService.getFeaturedLeader().subscribe(
      leader => (this.leader = leader),
      errMessage => (this.leaderErrMessage = <any>errMessage)
    );
  }
}

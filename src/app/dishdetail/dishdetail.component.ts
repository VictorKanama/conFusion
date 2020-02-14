import {
  Component,
  OnInit,
  createPlatformFactory,
  ViewChild,
  Inject
} from "@angular/core";
import { Dish } from "../shared/dish";
import { Comment } from "../shared/comment";
import { Params, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { DishService } from "../services/dish.service";
import { switchMap } from "rxjs/internal/operators/switchMap";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-dishdetail",
  templateUrl: "./dishdetail.component.html",
  styleUrls: ["./dishdetail.component.scss"]
})
export class DishdetailComponent implements OnInit {
  dish: Dish;
  dishIds: string[];
  dishComments: Comment[];
  prev: string;
  next: string;
  errMessage: string;

  @ViewChild("fform") commentFormDirective; // to ensure the form is reset to its initial value

  commentForm: FormGroup;

  formErrors = {
    author: "",
    comment: ""
  };

  validationMessages = {
    author: {
      required: "Author is required.",
      minlength: "Author must be at least 2 characters long."
    },
    comment: {
      required: "Comment is required."
    }
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private dishService: DishService,
    @Inject("BaseURL") private BaseURL
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.dishService
      .getDishIds()
      .subscribe(dishIds => (this.dishIds = dishIds));
    this.route.params
      .pipe(
        switchMap((params: Params) => this.dishService.getDish(params["id"]))
      )
      .subscribe(
        dish => {
          this.dish = dish;
          // console.log(dish.id);
          this.setPrevNext(dish.id);
          this.dishComments = dish.comments;
        },
        errMessage => (this.errMessage = <any>errMessage)
      );
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[
      (this.dishIds.length + index - 1) % this.dishIds.length
    ];
    this.next = this.dishIds[
      (this.dishIds.length + index + 1) % this.dishIds.length
    ];
    // console.log(this.prev);
    // console.log(this.next);
  }

  createForm() {
    this.commentForm = this.fb.group({
      rating: 5,
      comment: ["", Validators.required],
      author: ["", [Validators.required, Validators.minLength(2)]],
      date: new Date().toISOString()
    });

    this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) {
      return;
    } //if form not created
    const form = this.commentForm;

    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous erros message (if any)
        this.formErrors[field] = "";
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + " ";
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.dishComments.push(this.commentForm.value);
    console.log(this.dishComments);
    this.commentFormDirective.resetForm();
    this.commentForm.reset({
      rating: 5,
      comment: "",
      author: "",
      date: new Date().toISOString()
    });
  }

  goBack(): void {
    this.location.back();
  }
}

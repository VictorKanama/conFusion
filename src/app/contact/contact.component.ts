import { Component, OnInit, ViewChild } from "@angular/core";
import { Feedback, ContactType } from "../shared/feedback";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FeedbackService } from "../services/feedback.service";
import { flyInOut, expand, visibility } from "../animations/app-animation";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
  host: {
    "[@flyInOut]": "true",
    style: "display: block;",
  },
  animations: [flyInOut(), expand(), visibility()],
})
export class ContactComponent implements OnInit {
  feedbackForm: FormGroup;
  feedback: Feedback;
  feedbackCopy: Feedback = null;
  contactType = ContactType;
  feedbackErrMessage: string;
  submittedForm = false;

  @ViewChild("fform") feedbackFormDirective; // to ensure the form is reset to its initial value

  formErrors = {
    firstname: "",
    lastname: "",
    telnum: "",
    email: "",
  };
  visibility = "shown";

  validationMessages = {
    firstname: {
      required: "First name is required.",
      minlength: "First name must be at least 2 characters long.",
      maxlength: "First name cannot be more than 25 characters long",
    },
    lastname: {
      required: "Last name is required.",
      minlength: "Last name must be at least 2 characters long.",
      maxlength: "Last name cannot be more than 25 characters long",
    },
    telnum: {
      required: "Tel.number is required.",
      pattern: "Tel.number must contain only numbers.",
    },
    email: {
      required: "Tel.number is required.",
      email: "Email is not valid.",
    },
  };
  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      lastname: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      telnum: [0, [Validators.required, Validators.pattern]],
      email: ["", [Validators.required, Validators.email]],
      agree: "",
      contacttype: "None",
      message: "",
    });

    this.feedbackForm.valueChanges.subscribe((data) =>
      this.onValueChanged(data)
    );

    this.onValueChanged(); // reset form validation messages
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) {
      return;
    } //if form not created
    const form = this.feedbackForm;

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
    this.feedbackCopy = this.feedbackForm.value;
    this.submittedForm = true; // show spinner
    this.feedbackService.submitFeedback(this.feedbackCopy).subscribe(
      (feedback) => {
        this.submittedForm = false; // hide
        this.feedback = feedback;
        setTimeout(() => {
          this.feedback = null;
        }, 5000);
        this.feedbackForm.reset({
          firstname: "",
          lastname: "",
          telum: 0,
          email: "",
          agree: false,
          contacttype: "None",
          message: "",
        });
        this.feedbackFormDirective.resetForm();
      },
      (errMessage) => (this.feedbackErrMessage = <any>errMessage)
    );
  }
}

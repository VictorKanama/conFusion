import { Component, OnInit, ViewChild } from "@angular/core";
import { Feedback, ContactType } from "../shared/feedback";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"]
})
export class ContactComponent implements OnInit {
  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;

  @ViewChild("fform") feedbackFormDirective; // to ensure the form is reset to its initail value

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      telnum: [0, Validators.required],
      email: ["", Validators.required],
      agree: "",
      contacttype: "None",
      message: ""
    });
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.feedbackForm.reset({
      firstname: "",
      lastname: "",
      telum: 0,
      email: "",
      agree: false,
      contacttype: "None",
      message: ""
    });
    this.feedbackFormDirective.resetForm();
  }
}

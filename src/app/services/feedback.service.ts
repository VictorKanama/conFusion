import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { baseURL } from "../shared/baseurl";
import { ProcessHTTPMsgService } from "./process-httpmsg.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Feedback } from "../shared/feedback";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Injectable({
  providedIn: "root"
})
export class FeedbackService {
  constructor(
    private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService
  ) {}

  submitFeedback(feedback: Feedback): Observable<Feedback> {
    return this.http
      .post<Feedback>(baseURL + "feedback", feedback, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}

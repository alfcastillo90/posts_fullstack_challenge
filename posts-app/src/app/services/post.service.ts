import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Post } from "../model/post";
@Injectable({
  providedIn: 'root'
})
export class PostService {
  // Node/Express API
  REST_API: string = 'https://peaceful-castle-96018.herokuapp.com/api';
  // Http Header
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private httpClient: HttpClient) { }
  // Add
  addPost(data: Post): Observable<any> {
    let API_URL = `${this.REST_API}/posts`;
    return this.httpClient.post(API_URL, data)
      .pipe(
        catchError(this.handleError)
      )
  }
  // Get all objects
  getPosts() {
    return this.httpClient.get(`${this.REST_API}/posts`);
  }
  // Get single object
  getPost(id:any): Observable<any> {
    let API_URL = `${this.REST_API}/posts/${id}`;
    return this.httpClient.get(API_URL, { headers: this.httpHeaders })
      .pipe(map((res: any) => {
          return res || {}
        }),
        catchError(this.handleError)
      )
  }

  updatePost(id:any, data:any): Observable<any> {
    let API_URL = `${this.REST_API}/posts/${id}`;
    return this.httpClient.put(API_URL, data, { headers: this.httpHeaders })
      .pipe(
        catchError(this.handleError)
      )
  }

  deletePost(id:any): Observable<any> {
    let API_URL = `${this.REST_API}/posts/${id}`;
    return this.httpClient.delete(API_URL, { headers: this.httpHeaders}).pipe(
      catchError(this.handleError)
    )
  }
  // Error
  handleError(error: HttpErrorResponse) {
    let errorMessage;
    if (error.error instanceof ErrorEvent) {
      // Handle client error
      errorMessage = error.error.message;
    } else {
      // Handle server error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}

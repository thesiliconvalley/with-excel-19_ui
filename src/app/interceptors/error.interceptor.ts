import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { SharedService } from '../modules/shared/services/shared.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private ngxUiLoader: NgxUiLoaderService,private sharedService:SharedService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let error:any
    return next.handle(request).pipe(catchError(err => {
        error = err.error.message || err.statusText
        this.ngxUiLoader.stopLoader('core-loader')
        if(err.status==403){
          this.sharedService.signOut()
        }
        return throwError(()=>error)
    })
    ,map((response:any)=>{
      if(response.status){
        this.ngxUiLoader.stopLoader('core-loader')
      }
      return response})
    )
  }
}

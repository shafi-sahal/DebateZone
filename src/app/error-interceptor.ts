import { HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse, HttpEvent} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorComponent } from './shared/components/error/error.component';
import { Spinner } from './shared/components/spinner/spinner.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog, private spinner: Spinner) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occured';
        this.spinner.hide();
        if (error.status === 401) return throwError(error);
        if (error.error.message) {
          errorMessage = error.error.message;
        }
        this.dialog.open(ErrorComponent, { data: { message: errorMessage }, panelClass: 'custom-dialog' });
        if (error.status === 0) return of(error.error);
        return throwError(error);
      })
    );
  }
}

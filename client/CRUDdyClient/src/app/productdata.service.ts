import { Injectable } from '@angular/core';
import { Product } from './product';
import { retry, catchError, tap } from 'rxjs/operators';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductdataService {
  constructor(private httpClient: HttpClient) {}

  public sendGetRequest1() {
    return this.httpClient.get('/api/products');
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
     
      errorMessage = `Error: ${error.error.message}`;
    } else {
      
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  public getProducts(archived: boolean = false) {
    let prodUrl = '/api/products';
    if (archived) {
      prodUrl = '/api/products/archived';
    }
    return this.httpClient
      .get<Product[]>(prodUrl, { observe: 'response' })
      .pipe(
        retry(3),
        catchError(this.handleError),
        tap((res) => {
          
        })
      );
  }

  public getProduct(id: string) {
    return this.httpClient
      .get<Product[]>('/api/product/' + id, { observe: 'response' })
      .pipe(
        retry(3),
        catchError(this.handleError),
        tap((res) => {
          
        })
      );
  }

  public createProduct(product: Product) {
    var headers = new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    return this.httpClient
      .post<Product[]>('/api/product', product, {
        observe: 'response',
        headers: headers as any,
      })
      .pipe(
        retry(3),
        catchError(this.handleError),
        tap((res) => {
         
        
        })
      );
  }

  public updateProduct(product: Product) {
    var headers = new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    return this.httpClient
      .put<Product[]>('/api/product', product, {
        observe: 'response',
        headers: headers as any,
      })
      .pipe(
        retry(3),
        catchError(this.handleError),
        tap((res) => {
         
        })
      );
  }

  public deleteProduct(id: string) {
    var headers = new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    return this.httpClient
      .delete<Product[]>('/api/product/' + id, {
        observe: 'response',
        headers: headers as any,
      })
      .pipe(
        retry(3),
        catchError(this.handleError),
        tap((res) => {
          
        })
      );
  }
}

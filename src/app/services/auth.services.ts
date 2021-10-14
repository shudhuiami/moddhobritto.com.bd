import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {CustomerAuthStore} from '../state/store.actions';

declare const $: any;

@Injectable({
  providedIn: 'root'
})

export class AuthServices {
  protected basePath = environment.API_URL;
  protected token = '';

  public defaultHeaders = new HttpHeaders();
  $store: any = null;

  constructor(private store: Store<{ store }>, protected httpClient: HttpClient) {
    this.getToken();
  }

  getToken(): any {
    let userData = localStorage.getItem('userData');
    let token = localStorage.getItem('token');
    if (token != null) {
      this.token = token;
      let data = {
        token: token,
        user: JSON.parse(userData)
      };
      this.store.dispatch(CustomerAuthStore({data: data}));
    }
  }
  public login(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    const headers = this.defaultHeaders;
    return this.httpClient.post(`${this.basePath}/auth/customer/login`, body, {headers});
  }
  public register(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    const headers = this.defaultHeaders;
    return this.httpClient.post(`${this.basePath}/auth/customer/register`, body, {headers});
  }
  public forgot(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    const headers = this.defaultHeaders;
    return this.httpClient.post(`${this.basePath}/auth/customer/forgot`, body, {headers});
  }
  public resetPassword = (body: any = 'body', reportProgress: boolean = false): Observable<any> => {
    const headers = this.defaultHeaders;
    return this.httpClient.post(`${this.basePath}/auth/customer/reset`, body, {headers});
  }
}

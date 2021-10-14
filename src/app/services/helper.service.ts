import {Inject, Injectable, Optional} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

declare const $: any;
import {HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpEvent} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AuthServices} from './auth.services';
import {ApiServices} from './api.services';
import {NotificationService} from './notification.service';
import {NavigationEnd} from '@angular/router';
import {GlobalCartStore} from '../state/store.actions';
import {Store} from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class HelperServices {
  protected token = '';
  protected basePath = environment.API_URL;
  public defaultHeaders = new HttpHeaders();

  WebsiteSettings = new BehaviorSubject<any>(null);
  currentWebsiteSettings = this.WebsiteSettings.asObservable();
  cartData = [];
  wishListData = null;
  Auth = null;

  cartItem = new BehaviorSubject<any>(null);
  currentCartItems = this.cartItem.asObservable();

  //Wishlist Count observe
  wished = new BehaviorSubject<any>(null);
  currentWishedList = this.wished.asObservable();
  $store: any = null;


  constructor(private store: Store<{store}>, protected httpClient: HttpClient, protected authServices: AuthServices, protected apiServices: ApiServices, protected notificationServices: NotificationService) {
    this.$store = this.store.select("store").subscribe((data) => {
      this.token = data.token;
      this.Auth = data.user;

    })

  }

  // Wishlist
  updateWishedList (data):void{
    this.wished.next(data)
  }

  updateWished(data):void{
    this.wished.next(data)
  }


  updateCartItems(data): void {
    this.cartItem.next(data);
  }

  updateCart(data): void {
    this.cartItem.next(data);
  }
  updateWebsiteSettings(settings): void {
    this.WebsiteSettings.next(settings);
  }

  /**
   * Get Web Global Data
   * @param observe
   * @param reportProgress
   */
  public webSettings(observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/get-website`, '', {headers});
  }

  addToCart = (event, product_id, quantity, variant_id) => {
    let trigger = $(event.target);
    if (!trigger.hasClass('btn')) {
      trigger = trigger.parent();
    }
    let formData = {product_id: product_id, quantity: quantity, variant_id};
    let guest_user_id = localStorage.getItem('guest_user_id');
    if (guest_user_id != null) {
      formData['guest_user_id'] = guest_user_id;
    }
    this.apiServices.addToCart(formData).subscribe(res => {
      if (res.status === 2000) {
        this.notificationServices.showInfo('success', 'Added to cart');
        if (res.guest_user_id != null) {
          localStorage.setItem('guest_user_id', res.guest_user_id);
        }
        this.getCart();
      }
    });

  };

  /**
   * Get Cart Data
   *
   */
  getCart = () => {
    let formData = {};
    let guest_user_id = localStorage.getItem( 'guest_user_id');
    if(guest_user_id != null){
      formData['guest_user_id'] = guest_user_id;
    }
    this.apiServices.getCart(formData).subscribe(res => {
      if (res.status === 2000) {
        let Cart = {
          cartList: res.data,
          total_price: res.info.total_price,
          total_products: res.info.total_products,
        }
        this.store.dispatch(GlobalCartStore({data: Cart}))
      }
    });
  };

  //  Wishlist Count
  getWishLists = () => {
    this.apiServices.getWishList(null).subscribe(res => {
      if (res.status === 2000) {
        this.updateWishedList(res.data);
        this.wishListData = res;
        this.updateWished(res);
      }
    });
  }


  ngOnInit() {

}}


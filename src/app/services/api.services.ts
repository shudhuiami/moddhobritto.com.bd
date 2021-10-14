import {Inject, Injectable, Optional} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpEvent} from '@angular/common/http';
import {Observable, BehaviorSubject} from 'rxjs';
import {AuthServices} from './auth.services';
import {Store} from '@ngrx/store';

declare const $: any;

@Injectable({
  providedIn: 'root'
})
export class ApiServices {
  protected basePath = environment.API_URL;
  protected MediaPath = environment.MEDIA_URL;
  protected token = '';
  public defaultHeaders = new HttpHeaders();

  /*
  * Most Search Observable
  */
  mostSearchID = new BehaviorSubject<any>(null);
  CurrentMostSearch = this.mostSearchID.asObservable();

  categories = new BehaviorSubject<any>(null);
  allCategories = this.categories.asObservable();

  ShopId = new BehaviorSubject<any>(null);
  currentShopId = this.ShopId.asObservable();

  Shop = new BehaviorSubject<any>(null);
  currentShop = this.Shop.asObservable();

  filterSearch = new BehaviorSubject<any>(null);
  currentFilterSearch = this.filterSearch.asObservable();

  filterData = new BehaviorSubject<any>(null);
  CurrentFilterData = this.filterData.asObservable();

  /*
  * Pages
  */
  pages = new BehaviorSubject<any>(null);
  CurrentPages = this.pages.asObservable();
  $store: any = null;

  constructor(private store: Store<{ store }>, protected httpClient: HttpClient) {
    this.$store = this.store.select('store').subscribe((data) => {
      this.token = data.token;

    });
  }

  updatePage(page): void {
    this.pages.next(page);
  }

  updateCategories(cate): void {
    this.categories.next(cate);
  }

  updateMostSearch(MS): void {
    this.mostSearchID.next(MS);
  }

  updateShopId(ID): void {
    this.ShopId.next(ID);
  }

  updateShop(ID): void {
    this.Shop.next(ID);
  }

  updateFilterSearch(filter): void {
    this.filterSearch.next(filter);
  }

  upadteFilterData(f): void {
    this.filterData.next(f);
  }


  /**
   * get shop
   * @param observe
   * @param reportProgress
   */
  public getAllShops(observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/get-all-shops`, '', {headers});
  }

  /**
   * get shop
   * @param observe
   * @param reportProgress
   */
  public getSubShops(shopId: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/${encodeURIComponent(String(shopId))}/get-all-sub-shops`, '', {headers});
  }

  /**
   * get category
   * @param observe
   * @param reportProgress
   */
  public getAllCategory(shopId: any, body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/${encodeURIComponent(String(shopId))}/categories`, body, {headers});
  }

  public getShopDetails(shopSlug: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/${encodeURIComponent(String(shopSlug))}/get_details`, {headers});
  }

  /**
   * get category
   * @param observe
   * @param reportProgress
   */
  public getAllBrand(shopId: any, body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/${encodeURIComponent(String(shopId))}/brand`, body, {headers});
  }


  /**
   * get home
   * @param observe
   * @param reportProgress
   */
  public getAllHome(slug: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/${slug}/home`, '', {headers});
  }
  /**
   * get Brands
   * @param observe
   * @param reportProgress
   */
  public getBrand(slug: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/${slug}/home/get/brand`, '', {headers});
  }

  /**
   * get featured
   * @param observe
   * @param reportProgress
   */
  public getFeatured(slug: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/${slug}/feature_product`, '', {headers});
  }

  /**
   * get static page
   * @param observe
   * @param reportProgress
   */
  public getAllPages(observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/global-pages`, '', {headers});
  }

  /**
   * get Shop Header Slider
   * @param observe
   * @param reportProgress
   */
  public getShopHeaderSlider(shopId: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/${encodeURIComponent(String(shopId))}/get_slide`, '', {headers});
  }

  /**
   * get Shop top sell
   * @param observe
   * @param reportProgress
   */
  public topSell(shopId: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/${encodeURIComponent(String(shopId))}/top/sell`, '', {headers});
  }

  /**
   * get Shop top rated
   * @param observe
   * @param reportProgress
   */
  public topRated(shopId: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/${encodeURIComponent(String(shopId))}/top/rated`, '', {headers});
  }

  /**
   * get static page single
   * @param observe
   * @param reportProgress
   */
  public getSinglePage(shop_slug: any, page_slug: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/${shop_slug}/static-pages/${page_slug}`, '', {headers});
  }


  public getSinglePageGlobal(page_slug: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/global-pages/${page_slug}`, '', {headers});
  }

  /**
   * get page details
   * @param observe
   * @param reportProgress
   */
  public getAllDetail(shopId: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/${encodeURIComponent(String(shopId))}/get_details`, '', {headers});
  }

  /**
   * get header Slider data
   * @param observe
   * @param reportProgress
   */
  public getHeaderSlider(observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/get-all-global-slides`, '', {headers});
  }


  public getDeals(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/get-offered`, body, {headers});
  }


  /**
   * get Shop Category Product data
   * @param observe
   * @param reportProgress
   */
  public getShopCategoryProduct(shop_slug: any, category_slug: any, body: any, observe: any = 'body',
                                reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/${shop_slug}/${category_slug}/products`, body, {headers});
  }

  /**
   * get Single Product data
   * @param observe
   * @param reportProgress
   */
  public SingleProductData(shop_slug: any, product_slug: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/${shop_slug}/product-details/${product_slug}`, '', {headers});
  }

  /**
   * get Public Single Product data
   * @param observe
   * @param reportProgress
   */
  public PublicSingleProductData(category_slug: any, product_slug: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/${category_slug}/public-products/${product_slug}`, '', {headers});
  }


  /**
   * Add To Wishlist
   * @param observe
   * @param reportProgress
   */
  public addToWishlist(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/account/customer/wishlist/add`, body, {headers});
  }

  /**
   * Delete Wishlist
   * @param observe
   * @param reportProgress
   */
  public deleteWishList(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/account/customer/wishlist/delete`, body, {headers});
  }

  /**
   * Add To Cart
   * @param observe
   * @param reportProgress
   */
  public addToCart(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    let response = this.httpClient.post(`${this.basePath}/account/customer/cart/add`, body, {headers});
    return response;
  }

  /**
   * Get  Cart
   * @param observe
   * @param reportProgress
   */
  public getCart(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/account/customer/cart/get`, body, {headers});
  }

  public SendActivationCode(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/account/customer/resend/code`, body, {headers});
  }
  public ActiveAccountSubmit(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/account/customer/account/activation`, body, {headers});
  }


  /**
   * Delete cart item
   * @param observe
   * @param reportProgress
   */
  public DeleteCartItem(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/account/customer/cart/delete`, body, {headers});
  }


  /**
   * Get Wishlists
   * @param observe
   * @param reportProgress
   */

  public getWishList(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/account/customer/wishlist/get`, body, {headers});
  }

  /**
   * Create Orders
   * @param observe
   * @param reportProgress
   */
  public createOrder(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/account/customer/order/create`, body, {headers});
  }


  /**
   * Get Profile
   * @param observe
   * @param reportProgress
   */
  public getProfile(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/account/customer/get/profile`, body, {headers});
  }


  /**
   * Update Profile
   * @param observe
   * @param reportProgress
   */

  public UpdateProfile(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/account/customer/update/profile`, body, {headers});
  }

  /**
   * Change Password
   * @param observe
   * @param reportProgress
   */

  public ChangePassword(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/account/customer/update/password`, body, {headers});
  }

  /**
   * Get Orders
   * @param observe
   * @param reportProgress
   */

  public getOrders(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/account/customer/get/orders`, body, {headers});
  }

  public getOrderDetail(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/account/customer/get/order/detail`, body, {headers});
  }

  /**
   * Cancel Orders
   * @param observe
   * @param reportProgress
   */

  public cancelOrder(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/account/customer/cancel/order`, body, {headers});
  }


  /**
   * Search Products
   * @param observe
   * @param reportProgress
   */

  public SearchProducts(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/get/products`, body, {headers});
  }

  /**
   * Most Search
   * @param observe
   * @param reportProgress
   */

  public mostSearch(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    return this.httpClient.post(`${this.basePath}/most/search`, body, {headers});
  }


  public getPartners(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    return this.httpClient.post(`${this.basePath}/get/partners`, body, {headers});
  }

  public getFeaturedShop(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    return this.httpClient.post(`${this.basePath}/get-featured-shops`, body, {headers});
  }
  public category(category_slug: any, body: any,  observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    return this.httpClient.post(`${this.basePath}/${category_slug}/products`, body, {headers});
  }
  public categorylist(category_slug: any, body: any,  observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    return this.httpClient.post(`${this.basePath}/${category_slug}/get_shop_categories`, body, {headers});
  }

  /**
   * Get Address
   * @param observe
   * @param reportProgress
   */

  public getAddress(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/account/customer/address/get`, body, {headers});
  }

  /**
   * Get Division
   * @param observe
   * @param reportProgress
   */

  public getDivision(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.get(`${this.basePath}/account/customer/get/division`, {headers});
  }

  /**
   * Get District
   * @param observe
   * @param reportProgress
   */

  public getDistrict(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/account/customer/get/district`, body, {headers});
  }

  /**
   * Get area
   * @param observe
   * @param reportProgress
   */

  public getArea(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/account/customer/get/area`, body, {headers});
  }


  /**
   * Create Address
   * @param observe
   * @param reportProgress
   */

  public createAddress(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/account/customer/address/add`, body, {headers});
  }

  /**
   * Edit Address
   * @param observe
   * @param reportProgress
   */

  public editAddress(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/account/customer/address/edit`, body, {headers});
  }

  /**
   * Edit Address
   * @param observe
   * @param reportProgress
   */

  public deleteAddress(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/account/customer/address/delete`, body, {headers});
  }

  /**
   * Get Payment Method
   * @param observe
   * @param reportProgress
   */

  public getPaymentMethod(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/account/customer/get/payment/methods`, body, {headers});
  }


  /**
   * News Letter
   * @param observe
   * @param reportProgress
   */
  public newsLetter(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    const headers = this.defaultHeaders;
    return this.httpClient.post(`${this.basePath}/auth/customer/newsletter`, body, {headers});
  }

  /**
   * Public Category
   * @param observe
   * @param reportProgress
   */
  public publicCategory(observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    return this.httpClient.post(`${this.basePath}/public-categories`, '', {headers});
  }

  /**
   * Public Product
   * @param observe
   * @param reportProgress
   */
  /**
   */
  public publicProducts(body: any,slug: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    const headers = this.defaultHeaders;

    return this.httpClient.post(`${this.basePath}/${slug}/public-products`, body, {headers});
  }

  public publicCategoryBanner(body: any,slug: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    const headers = this.defaultHeaders;
    return this.httpClient.post(`${this.basePath}/${slug}/public-products/banners`, body, {headers});
  }

  public UploadMedia(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.MediaPath}/media`, body, {headers});
  }

  public CreateMerchant(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/merchant/create`, body, {headers});
  }

  public RequestProduct(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/create/request/product`, body, {headers});
  }


//  Contact Us
  public contactUs(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    const headers = this.defaultHeaders;
    return this.httpClient.post(`${this.basePath}/contact-us`, body, {headers});
  }

  /**
   * Cash on Delivery payment
   * @param observe
   * @param reportProgress
   */

  public createCashOnDelivery(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/account/customer/payment/cash-on-delivery`, body, {headers});
  }
  public Transaction(body: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    if (this.token != null) {
      headers = headers.set('auth-tkn-key', this.token);
    }
    return this.httpClient.post(`${this.basePath}/account/customer/get/payment/transaction`, body, {headers});
  }
  public getProfileInfoByToken(token: any, body: any = 'body', observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;
    headers = headers.set('auth-tkn-key', token);
    return this.httpClient.post(`${this.basePath}/account/customer/get/profile`, '', {headers});
  }
}

import { Component, OnInit, Input } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {ApiServices} from '../services/api.services';
import {HttpClient} from '@angular/common/http';
import {AuthServices} from "../services/auth.services";
import {NotificationService} from '../services/notification.service';
import {HelperServices} from "../services/helper.service";
import {Store} from '@ngrx/store';
import {getGlobalShops, GlobalCartModal} from '../state/store.actions';

declare let $: any;
@Component({
  selector: 'app-product-box',
  templateUrl: './product-box.component.html',
})
export class productBoxComponent implements OnInit{
  @Input() public allCat : {};
  @Input() public eachProduct: any = {};
  @Input() public innerProducts: any = {};
  @Input() public cIndex : null;
  @Input() public fIndex : null;
  @Input() public innerIndex : null;

  Auth = null;
  price = 0;
  SingleData:any = {};
  loading = false;
  PLoading = false;
  singleLoading = false;
  quantity = 1;
  preview: null;
  Price: any = {};
  price_was: any = {};
  price_current: any = {};
  reduce_price: any = {};
  variants = {
    variant_id : 0
  }
  $store: any = null;
  constructor(private store: Store<{store}>,  private router: Router, private http: HttpClient,  protected notificationServices: NotificationService, protected helperService: HelperServices,   protected apiService: ApiServices, private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.$store = this.store.select("store").subscribe((data) => {
      this.Auth = data.auth;
    })
    let Product = this.eachProduct;
    this.Price = parseInt(Product.variants[0].price);
    if(Product.discount_type == 0){
      let Price = parseInt(this.Price) / 100 * parseInt(Product.discount_amount)
      this.price_was = parseInt(this.Price + Price)
      this.price_current = this.Price;
      this.reduce_price = Product.discount_amount;
    }else if (Product.discount_type == 1){
      this.price_was = parseInt(this.Price) + parseInt(Product.discount_amount)
      this.price_current = this.Price;
      this.reduce_price = Product.discount_amount
    }else if (Product.discount_type == 2){
      this.price_current = this.Price;
    }
  };
  ngOnDestroy(){
    this.$store.unsubscribe();
  }
  openModal = () => {
    $('#checkoutLoginModal').fadeIn(200);
  }
  showAddCartModal = (data) => {
    if (typeof data.features == "string"){
      data['features'] = JSON.parse(data.features);
    }
    this.store.dispatch(GlobalCartModal({data: data}))
    setTimeout(() => {
      $('.CartModal').addClass('active');
    },100)
    setTimeout(function () {
      $('#global-cart-image-slider').owlCarousel({
        loop: false,
        margin: 10,
        navText: ["<i class='las la-arrow-left'></i>", "<i class='las la-arrow-right'></i>"],
        nav: true,
        items: 1,

      });
    },500)
  }
  closeCartModal = () => {
    $('.CartModal').removeClass('active');
  }
  addToWishlist = (event, product_id, cIndex, index, innerIndex ) => {
    let trigger = $(event.target);
    let formData = {product_id: product_id};
    if(innerIndex != null){
      this.allCat[cIndex].products[index][innerIndex].wished = -1;
      this.apiService.addToWishlist(formData).subscribe(res => {
          if (res.status === 2000) {
            this.allCat[cIndex].products[index][innerIndex].wished = 1;
            this.notificationServices.showInfo('Success', 'Wishlist added');
          }else{
            this.allCat[cIndex].products[index][innerIndex].wished = null;
          }
        }
      );
    }else{
      if(cIndex != null){
        this.allCat[cIndex].products[index].wished = -1;
      }else{
        this.eachProduct.wished = -1;
      }
      this.apiService.addToWishlist(formData).subscribe(res => {
          if (res.status === 2000) {
            if(cIndex != null){
              this.allCat[cIndex].products[index].wished = 1;
            }else{
              this.eachProduct.wished = 1;
            }
            this.notificationServices.showInfo('Success', 'Wishlist added');
          }else{
            if(cIndex != null){
              this.allCat[cIndex].products[index].wished = null;
            }else{
              this.eachProduct.wished = null;
            }
          }
        }
      )
    }
  }
  deleteWishList = (event, product_id, cIndex, index, innerIndex) => {
    let trigger = $(event.target);
    let formData = {product_id: product_id};
    if(innerIndex == null){
      if(cIndex != null){
        this.allCat[cIndex].products[index].wished = -1;
      }else{
        this.eachProduct.wished = -1;
      }
      this.apiService.deleteWishList(formData).subscribe(res => {
          if (res.status === 2000) {
            if(cIndex != null){
              this.allCat[cIndex].products[index].wished = null;
            }else{
              this.eachProduct.wished = null;
            }
            this.notificationServices.showInfo('Removed', 'Wishlist Removed');
            this.getWishlist();
          }else{
            if(cIndex != null){
              this.allCat[cIndex].products[index].wished = 1;
            }else{
              this.eachProduct.wished = 1;
            }
          }
        }
      );
    }else{
      this.allCat[cIndex].products[index][innerIndex].wished = -1;
      this.apiService.deleteWishList(formData).subscribe(res => {
          if (res.status === 2000) {
            this.allCat[cIndex].products[index][innerIndex].wished = null;
            this.notificationServices.showInfo('Removed', 'Wishlist Removed');
            this.getWishlist();
          }else{
            this.allCat[cIndex].products[index][innerIndex].wished = 1;
          }
        }
      );
    }

  }
  getWishlist = () => {
    this.helperService.getWishLists();
  };
}


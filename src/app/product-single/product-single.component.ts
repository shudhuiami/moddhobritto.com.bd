import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {HelperServices} from '../services/helper.service';
import {ApiServices} from '../services/api.services';
import {NotificationService} from '../services/notification.service';
import {AuthServices} from '../services/auth.services';
import {Store} from '@ngrx/store';

declare let $: any;

@Component({
  selector: 'app-product-single',
  templateUrl: './product-single.component.html',
})
export class ProductSingleComponent implements OnInit {
  bodyParam = {
    tree: true,
  };
  productDetails: any = {};
  imgSrc = null;
  product_slug: any = '';
  shop_slug: any = '';
  featured: any = '';
  Auth = null;
  loading = false;
  Price = 0;
  quantity = 1;
  SingleData: any = {};
  price: 0;
  preview: null;
  price_was: any = {};
  price_current: any = {};
  reduce_price: any = {};
  requirements: '';
  variants = {
    variant_id : 0
  };
  singleLoading = false;
  $store: any = null;
  constructor(private store: Store<{store}>, private router: Router, protected apiServices: ApiServices, private route: ActivatedRoute, protected authService: AuthServices, protected helperService: HelperServices, protected notificationServices: NotificationService) {
    this.product_slug = this.route.snapshot.paramMap.get('product_slug');
    this.shop_slug = this.route.snapshot.paramMap.get('slug');
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.apiServices.currentShopId.subscribe(res => {
          if (res != null){
            this.shop_slug = res;
            this.product_slug = this.route.snapshot.paramMap.get('product_slug');
            this.shop_slug = this.route.snapshot.paramMap.get('slug');
            this.productData();
          }
        });
      }
    });
  }

  getWishlist = () => {
    this.helperService.getWishLists();
  };

  ngOnInit(): void {
    this.$store = this.store.select("store").subscribe((data) => {
      this.Auth = data.auth;
    })

    this.productData();

    $('.category-nav').removeClass('show');

    $('.top-rated-slider').owlCarousel({
      loop: true,
      margin: 10,
      nav: true,
      items: 1
    });

    $('.top-sellers-slider').owlCarousel({
      loop: true,
      margin: 10,
      nav: true,
      items: 1
    });

    $('.special-slider').owlCarousel({
      animateOut: 'fadeOut',
      animateIn: 'fadeIn',
      items: 1,
      loop: true,
      nav: true,
      drag: false,
      margin: 0,
      smartSpeed: 450
    });
  }

  ngOnDestroy(){
    this.$store.unsubscribe();
  }

  productData = () => {
    this.loading = true;
    this.apiServices.SingleProductData(this.shop_slug, this.product_slug).subscribe(res => {
      this.loading = false;
      if (res.status === 2000) {
        res.data['features'] = JSON.parse(res.data.features);
        this.variants.variant_id = res.data.variants[0].id
        this.Price = parseInt(res.data.variants[0].price)
        this.productDetails = res.data;
        let Product =  this.productDetails;
        if(Product.discount_type == 0){
          let Price = this.Price / 100 * parseInt(Product.discount_amount)
          this.price_was = this.Price + Price;
          this.price_current = this.Price;
          this.reduce_price = parseInt(Product.discount_amount)
          console.log(this.price_current, this.price_was, this.reduce_price)
        }else if (Product.discount_type == 1){
          this.price_was = this.Price + parseInt(Product.discount_amount);
          this.price_current = this.Price;
          this.reduce_price = parseInt(Product.discount_amount)
        }else if (Product.discount_type == 2){
          this.price_current = this.Price;
        }
      }
    });
  };

  objectCheck = (object) => {
    if (Object.keys(object).length > 0) {
      return true;
    } else {
      return false;
    }
  };


  //Single Product Wishlist
  singleProductWishlist = (event, product_id) => {
    this.loading = true;
    let trigger = $(event.target);
    let formData = {product_id: product_id};
    this.apiServices.addToWishlist(formData).subscribe(res => {
      this.loading = false;
        if (res.status === 2000) {
          this.notificationServices.showInfo('Success', 'WishList Added Successful');
          this.productDetails.wished = 1;
          this.getWishlist();
        }
      }
    );
  };
  // Single Product Delete Wishlist
  deleteSingleWishList = (event, product_id) => {
    let trigger = $(event.target);
    let formData = {product_id: product_id};
    this.apiServices.deleteWishList(formData).subscribe(res => {
        if (res.status === 2000) {
          this.productDetails.wished = 0;
          this.notificationServices.showInfo('Removed', 'WishList Removed Successful');
          this.getWishlist();
        }
      }
    );
  };

  addToCart = (event, product_id) => {
    console.log(product_id, this.quantity, this.variants.variant_id )
    this.helperService.addToCart(event, product_id, this.quantity, this.variants.variant_id);
    this.quantity = 1;
    setTimeout(() => {
      $('.CartModal').removeClass('active');
    }, 1000 );
  }

  increase = () => {
    this.quantity = this.quantity + 1;
    if (this.quantity > 1) {
      $('.btn-minus').removeAttr('disabled');
    }
  }
  decrease = () => {
    this.quantity = this.quantity - 1;
    if (this.quantity == 1) {
      $('.btn-minus').attr('disabled', true);
    }
  }
  selectVariant(variant){
    this.variants.variant_id = variant.id;
    this.Price = parseInt(variant.price)
    let Product = this.productDetails;
    if(Product.discount_type == 0){
      let Price = this.Price / 100 * parseInt(Product.discount_amount)
      this.price_was = this.Price + Price;
      this.price_current = this.Price;
      this.reduce_price = parseInt(Product.discount_amount)
    }else if (Product.discount_type == 1){
      this.price_was = this.Price + parseInt(Product.discount_amount);
      this.price_current = this.Price;
      this.reduce_price = parseInt(Product.discount_amount)
    }else if (Product.discount_type == 2){
      this.price_current = this.Price;
    }
  }

  showImage = (value) => {
    this.imgSrc = value;
  };
  //wishlist
  addToWishlist = (event, product_id, index) => {
    let trigger = $(event.target);
    let formData = {product_id: product_id};
    trigger.closest('.btn').html('<i class="las la-spinner la-spin"></i>');
    this.apiServices.addToWishlist(formData).subscribe(res => {
        if (res.status === 2000) {
          let indexF = this.featured.map(function(e) {
            return e.id;
          }).indexOf(product_id);
          if (indexF > -1) {
            this.featured[indexF].wished = 1;
          }
          trigger.closest('.btn').html('<i class="la-heart lar"></i>');
          this.notificationServices.showInfo('Success', 'WishList Added Successful');
          this.getWishlist();
        }
      }
    );
  };

  deleteWishList = (event, product_id, index) => {
    let trigger = $(event.target);
    let formData = {product_id: product_id};
    trigger.closest('.btn').html('<i class="las la-spinner la-spin"></i>');
    this.apiServices.deleteWishList(formData).subscribe(res => {
        if (res.status === 2000) {
          let indexF = this.featured.map(function(e) {
            return e.id;
          }).indexOf(product_id);

          if (indexF > -1) {
            this.featured[indexF].wished = null;
          }
          this.notificationServices.showInfo('Removed', 'Wishlist Removed');
          trigger.closest('.btn').html('<i class="las la-heart"></i>');
          this.getWishlist();
        }
      }
    );
  };
  openModal = () => {
    $('#checkoutLoginModal').fadeIn(200);
  };

  //Add To Cart
  addToCartsingle = (event, product_id, shop_id) => {

    let trigger = $(event.target);
    if (!trigger.hasClass('btn')) {
      trigger = trigger.parent();
    }
    trigger.html('<i class="las la-spinner la-spin"></i>   ADD TO CART');
    let formData = {product_id: product_id, quantity: this.quantity, variant_id: this.variants.variant_id, shop_id:shop_id, requirements:this.requirements};
    let guest_user_id = localStorage.getItem('guest_user_id');
    if (guest_user_id != null) {
      formData['guest_user_id'] = guest_user_id;
    }
    this.apiServices.addToCart(formData).subscribe(res => {
      if (res.status === 2000) {
        trigger.closest('.btn').html('<i class="las la-cart-plus"></i>   ADD TO CART');
        this.notificationServices.showInfo('success', 'Added to cart');
        if (guest_user_id == null) {
          localStorage.setItem('guest_user_id', res.guest_user_id);
        }
        this.helperService.getCart();
      }
    });

  };

}

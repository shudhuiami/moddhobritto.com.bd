import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {environment} from '../../environments/environment';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {ApiServices} from '../services/api.services';
import {HelperServices} from '../services/helper.service';
import {NotificationService} from '../services/notification.service';
import {AuthServices} from '../services/auth.services';
import {Store} from '@ngrx/store';

declare let $: any;

@Component({
  selector: 'app-product',
  templateUrl: './products.component.html',
})
export class BrandProductsComponent implements OnInit {
  ENV = environment;
  bodyParam = {
    tree: true,
  };
  options: any = {
    floor: '',
    ceil: ''
  };

  categories  = [];
  products = [];
  loading = false;
  min_max_price = true;
  category_slug: any = '';
  shop_slug: any = '';
  slideLoading = true;
  param: any = {
    filter: '',
    limit: 20,
    page: 1,
    keyword: '',
    start_price: '',
    end_price: ''
  };
  totalPage: any = 0;
  totalData: any = 0;
  catName: any = '';
  Auth = null;
  laravelData: any = null;
  quantity = 1;
  SingleData: any = {};
  price: 0;
  preview: null;
  title: null;
  variants = {
    variant_id : 0
  };

  $store: any = null;
  constructor(private store: Store<{store}>, private router: Router, protected apiService: ApiServices, private route: ActivatedRoute, protected helperService: HelperServices, private location: Location, protected notificationServices: NotificationService, protected authServices: AuthServices) {

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.category_slug = this.route.snapshot.paramMap.get('brand_slug');
        this.shop_slug = this.route.snapshot.paramMap.get('slug');
        this.getCategoryProducts();
        this.getCategories();
        const catParam: any = this.route.snapshot.queryParamMap.get('cat');
        this.catName = catParam;
      }
    });
    this.apiService.CurrentFilterData.subscribe((filter) => {
      if (filter != null) {
        this.param.keyword = filter.keyword;
        this.param.start_price = filter.startPrice;
        this.param.end_price = filter.endPrice;
        this.getCategoryProducts();
      }
    });
  }

  getCategories = () => {
    this.loading = true;
    this.apiService.getAllBrand(this.shop_slug, this.bodyParam).subscribe(res => {
      if (res.status === 2000) {
        this.categories = res.data;
        this.loading = false;
      }
    });
  };
  closeFilter = () => {
    $('.filter-section-wrap').css('left','-100%');
  }
  callAll = () => {
    this.apiService.upadteFilterData(this.param);
  }

  toggleCategories = (n) => {
    if(n === 0){
      $('#SideCategoryModal').fadeIn()
    }else {
      $('#SideCategoryModal').fadeOut()
    }
  }
  showChildren(e): void {
    const target = $(e.target);
    target.closest('.parent').find('ul').toggle();
  }
  openModal = () => {
    $('#checkoutLoginModal').fadeIn(200);
  };

  ngOnInit(): void {
    $('.category-nav').removeClass('show');
    this.$store = this.store.select("store").subscribe((data) => {
      this.Auth = data.auth;
    })
  }
  ngOnDestroy(){
    this.$store.unsubscribe();
  }
  openFilter = () => {
    $('.filter-section-wrap').css('left', '0');
  }
  getWishlist = () => {
    this.helperService.getWishLists();
  }
  // Category Product
  getCategoryProducts = () =>   {
    this.slideLoading = true;
    this.apiService.getShopCategoryProduct(this.shop_slug, this.category_slug, this.param).subscribe(response => {

      if (response.status === 2000) {
        this.products = response.data.data;

        if (response.price != null){
          this.min_max_price = false;

          this.param.start_price = response.price.min_price
          this.param.end_price = response.price.max_price

          this.options.floor = response.price.min_price
          this.options.ceil = response.price.max_price

        }
        this.laravelData = response.data;
        this.title = response.title;
        this.slideLoading = false;
      }else{
        this.slideLoading = false;
      }
    });
  };


  changePage(pagination): void {
    this.param.page = pagination.page;
    this.getCategoryProducts();
  }

  //Add To Cart
  addToCart = (event, product_id) => {
    this.helperService.addToCart(event, product_id, this.quantity, this.variants.variant_id);
    let cartCount = $('.count');

   setTimeout(() =>{
     let cartBtn = event.target;
     let cartCountPosition = $(cartCount).offset();
     let btnPosition = $(cartBtn).offset();
     let leftPos =
       cartCountPosition.left < btnPosition.left
         ? btnPosition.left - (btnPosition.left - cartCountPosition.left)
         : cartCountPosition.left;
     let topPos =
       cartCountPosition.top < btnPosition.top
         ? cartCountPosition.top
         : cartCountPosition.top;

     $(cartBtn).find(".countdummy").each(function(i,count){
       $(count).offset({
         left: leftPos,
         top: topPos
       })
         .animate(
           {
             opacity: 0
           },
           3000,
           function() {
             $(this).remove();
           }
         );
     });

   },2000)

  };

  addToWishlist = (event, product_id, index) => {
    console.log(product_id, index)
    let trigger = $(event.target);
    let formData = {product_id: product_id};
    this.products[index].wished = -1;
    this.apiService.addToWishlist(formData).subscribe(res => {
        if (res.status === 2000) {
          this.products[index].wished = 1;
          this.notificationServices.showInfo('Success', 'WishList Added Successful');
          this.getWishlist();
        }else{
          this.products[index].wished = null;
        }
      }
    );
  }
  deleteWishList = (event, product_id,  index) => {
    let trigger = $(event.target);
    let formData = {product_id: product_id};
    this.products[index].wished = -1;
    this.apiService.deleteWishList(formData).subscribe(res => {
        if (res.status === 2000) {
          this.products[index].wished = null;
          this.notificationServices.showInfo('Removed', 'Wishlist Removed');
          this.getWishlist();
        }else{
          this.products[index].wished = 1;
        }
      }
    );
  }


  showAddCartModal = (data) => {
    const SingleData = data;
    this.SingleData = SingleData;
    if (SingleData.discount_type !== 2){
      this.price = SingleData.variants[0].price;
    }else{
      this.price = SingleData.variants[0].price;
    }
    this.variants.variant_id = SingleData.variants[0].id
    this.preview = SingleData.images[0].image_full_path;
    $('.CartModal').addClass('active');

  }
  closeCartModal = () => {
    $('.CartModal').removeClass('active');
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
  showImage = (value) => {
    this.preview = value;
  }
  selectVariant(id){
    this.variants.variant_id = id;
    console.log(this.variants.variant_id)
  }
}

import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {environment} from '../../environments/environment';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {ApiServices} from '../services/api.services';
import {HelperServices} from '../services/helper.service';
import {NotificationService} from '../services/notification.service';
import {AuthServices} from '../services/auth.services';
import {productBoxComponent} from "../product-box/product-box.component";
import {Store} from '@ngrx/store';

declare let $: any;

@Component({
  selector: 'app-product',
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  ENV = environment;
  bodyParam = {
    tree: true,
    hide_empty_category: 1
  };
  products = [];
  category_slug: any = '';
  shop_slug: any = '';
  slideLoading = true;
  Loading = false;
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
  categories  = [];
  loading = false;
  price: 0;
  min_max_price = true;
  preview: null;
  variants = {
    variant_id : 0
  };
    options: any = {
      floor: '',
      ceil: ''
    };
  $store: any = null;
  constructor(private store: Store<{store}>, private router: Router, protected apiService: ApiServices, private route: ActivatedRoute, protected helperService: HelperServices, private location: Location, protected notificationServices: NotificationService, protected authServices: AuthServices) {
    this.shop_slug = this.route.snapshot.paramMap.get('slug');
    this.category_slug = this.route.snapshot.paramMap.get('category_slug');

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.shop_slug = this.route.snapshot.paramMap.get('slug');
        this.category_slug = this.route.snapshot.paramMap.get('category_slug');
        this.getCategoryProducts();
      }
    });
  }
  ngOnInit(): void {
    this.$store = this.store.select("store").subscribe((data) => {
      this.Auth = data.auth;
    })
    this.getCategories()
    this.getCategoryProducts();
  }
  ngOnDestroy(){
    this.$store.unsubscribe();
  }
  openFilter = () => {
    $('.filter-section-wrap').css('left', '0');
  }
  closeFilter = () => {
    $('.filter-section-wrap').css('left', '-100%');
  }
  toggleCategories = (n) => {
    if(n === 0){
      $('#SideCategoryModal').fadeIn()
    }else {
      $('#SideCategoryModal').fadeOut()
    }
  }
  getCategoryProducts = () => {
    this.Loading = true;
    this.apiService.getShopCategoryProduct(this.shop_slug, this.category_slug, this.param).subscribe(response => {
      this.Loading = false;
      if (response.status === 2000) {
        this.laravelData = response.data;
        if (response.price != null){
          this.min_max_price = false;

          this.param.start_price = response.price.min_price
          this.param.end_price = response.price.max_price

          this.options.floor = response.price.min_price
          this.options.ceil = response.price.max_price

        }
        this.catName = response.title;
        let AllProducts = [];
        $.each(response.data.data, (index, product) => {
          product['features'] = JSON.parse(product.features);
          if (product['features'].length > 6) {
            product['features'].length = 6;
          }
          AllProducts.push(product);
        });
        this.products = AllProducts;

      }
    });
  };
  getCategories = () => {
    this.loading = true;
    if (this.shop_slug != null) {
      this.apiService.getAllCategory(this.shop_slug,  this.bodyParam).subscribe(res => {
        if (res.status === 2000) {
          this.categories = res.data;
          this.loading = false;
        }
      });
    }
  }

  changePage(pagination): void {
    this.param.page = pagination.page;
    this.getCategoryProducts();
  }
}

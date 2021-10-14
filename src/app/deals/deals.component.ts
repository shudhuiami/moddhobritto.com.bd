import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ApiServices} from '../services/api.services';
import {HelperServices} from '../services/helper.service';
import {NotificationService} from '../services/notification.service';
import {AuthServices} from '../services/auth.services';
import {Store} from "@ngrx/store";
import {Location} from "@angular/common";

declare let $: any;

@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
})
export class DealsComponent implements OnInit {
  ENV = environment;
  bodyParam = {
    tree: true,
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
  preview: null;
  min_max_price = true;
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
      }
    });
  }
  ngOnInit(): void {
    this.$store = this.store.select("store").subscribe((data) => {
      this.Auth = data.auth;
    })
    this.getDeal()
  }
  ngOnDestroy(){
    this.$store.unsubscribe();
  }
  openFilter = () => {
    $('.filter-section-wrap').css('left', '0');
  }
  changePage(pagination): void {
    this.param.page = pagination.page;
    this.getDeal()
  }
  closeFilter = () => {
    $('.filter-section-wrap').css('left', '-100%');
  }
  getDeal = () => {
    this.Loading = true;
    this.apiService.getDeals(this.param).subscribe(response => {
      this.Loading = false;
      if (response.status === 2000) {
        this.products = response.data.data;
        this.laravelData = response.data;
        if (response.price != null){
          this.min_max_price = false;

          this.param.start_price = response.price.min_price
          this.param.end_price = response.price.max_price

          this.options.floor = response.price.min_price
          this.options.ceil = response.price.max_price

        }
      }
    });
  }

}


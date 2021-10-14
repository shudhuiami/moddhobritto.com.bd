import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ApiServices} from '../services/api.services';
import {HelperServices} from '../services/helper.service';
import {NotificationService} from '../services/notification.service';
import {AuthServices} from '../services/auth.services';

declare let $: any;

@Component({
  selector: 'app-public-products',
  templateUrl: './public-products.component.html',
})
export class publicProductsComponent implements OnInit {
  ENV = environment;
  CategoryData = [];
  BannerData = [];
  wishLists = [];
  slideLoading = false;
  min_max_price = true;
  Auth = null;
  totalPage: any = 0;
  totalData: any = 0;
  param: any = {
    filter: '',
    limit: 20,
    page: 1,
    keyword: '',
    start_price: '',
    end_price: ''
  };
  options: any = {
    floor: '',
    ceil: ''
  };
  laravelData: any = null;
  category_slug: any = '';
  quantity = 1;
  SingleData: any = {};
  price: 0;
  preview: null;
  variants = {
    variant_id : 0
  };
  constructor(private router: Router, private http: HttpClient, protected authService: AuthServices, protected helperService: HelperServices, protected notificationServices: NotificationService, private route: ActivatedRoute, protected apiServices: ApiServices) {
    this.category_slug = this.route.snapshot.paramMap.get('category_slug');
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.category_slug = this.route.snapshot.paramMap.get('category_slug');
        this.GetProducts()
        this.GetPublicCategoryBanner();

      }
    });
  }
  ngOnInit(): void {

  }

  closeFilter = () => {
    $('.filter-section-wrap').css('left', '-100%');
  }
  openFilter = () => {
    $('.filter-section-wrap').css('left', '0');
  }

//  Search Products
  GetProducts = () => {
    this.slideLoading = true;
    this.apiServices.publicProducts(this.param, this.category_slug).subscribe(res=> {
      if (res.status === 2000){
        this.CategoryData = res.data.data
        if (res.price != null){
          this.min_max_price = false;

          this.param.start_price = res.price.min_price
          this.param.end_price = res.price.max_price

          this.options.floor = res.price.min_price
          this.options.ceil = res.price.max_price

        }
        this.laravelData = res.data
        this.slideLoading = false;
      }else{
        this.slideLoading = false;
      }
    });
  }
  GetPublicCategoryBanner = () => {
    this.slideLoading = true;
    this.apiServices.publicCategoryBanner(this.param, this.category_slug).subscribe(res=> {
      if (res.status === 2000){
        this.slideLoading = false;
        this.BannerData = res.data
      }else{
        this.slideLoading = false;
      }
    });
  }
  changePage(pagination): void {
    this.param.page = pagination.page;
    this.GetProducts();
  }
  isVisible(page): any {
    const paginationLimit = 4;
    if (this.param.pageNo > paginationLimit && this.param.pageNo <= (this.totalPage - paginationLimit)) {
      if (page < (this.param.pageNo - paginationLimit)) {
        return false;
      } else if (page > (this.param.pageNo + paginationLimit)) {
        return  false;
      } else {
        return true;
      }
    } else if (this.param.pageNo <= paginationLimit && page <= ((paginationLimit * 2) + 1)) {
      return true;
    } else if (this.param.pageNo > (this.totalPage - paginationLimit) && page >= this.totalPage - ((paginationLimit * 2) + 1)) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * previous page
   */
  prePage(): void {
    if (this.param.pageNo != 1) {
      this.param.pageNo--;
      this.GetProducts();
    }
  }
  /**
   * next page
   */
  nextPage(): void {
    if (this.param.pageNo < this.totalPage) {
      this.param.pageNo++;
      this.GetProducts();
    }
  }
}


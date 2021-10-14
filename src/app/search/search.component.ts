import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ApiServices} from '../services/api.services';
import {HelperServices} from '../services/helper.service';
import {NotificationService} from '../services/notification.service';
import {AuthServices} from '../services/auth.services';
import {Store} from '@ngrx/store';

declare let $: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
})
export class searchComponent implements OnInit {
  ENV = environment;
  SearchData = [];
  wishLists = [];
  slideLoading = true;
  Auth = null;
  totalPage: any = 0;
  totalData: any = 0;
  param: any = {
    filter: '',
    limit: 20,
    page: 1,
    keyword: '',
    start_price: 0,
    end_price: 200000
  };
  options: any = {
    floor: 0,
    ceil: 200000
  };
  laravelData: any = null;
  quantity = 1;
  SingleData: any = {};
  price: 0;
  preview: null;
  variants = {
    variant_id : 0
  };
  Loading = false;
  loading = false;
  $store: any = null;
  constructor(private store: Store<{store}>,  private router: Router, private http: HttpClient, protected authService: AuthServices, protected helperService: HelperServices, protected notificationServices: NotificationService, private route: ActivatedRoute, protected apiServices: ApiServices) {
    this.param.keyword = this.route.snapshot.paramMap.get('keyword');
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.param.keyword = this.route.snapshot.paramMap.get('keyword');
        this.searchProducts();
      }
    });
  }
  ngOnInit(): void {
    this.$store = this.store.select("store").subscribe((data) => {
      this.Auth = data.auth;
    })
  }
  ngOnDestroy(){
    this.$store.unsubscribe();
  }

  closeFilter = () => {
    $('.filter-section-wrap').css('left', '-100%');
  }
//  Search Products
  searchProducts = () => {
    this.slideLoading = true;

    this.apiServices.SearchProducts(this.param).subscribe(res=> {
      if (res.status === 2000){
        this.SearchData = res.data.data;
        this.laravelData = res.data;
        this.slideLoading = false;
        let AllProducts = [];
        $.each(res.data.data, (index, product) => {
          product['features'] = JSON.parse(product.features);
          if (product['features'].length > 6) {
            product['features'].length = 6;
          }
          AllProducts.push(product);
        });
        this.SearchData = AllProducts;
      }else{
        this.slideLoading = false;
      }
    });
  }
  changePage(pagination): void {
    this.param.page = pagination.page;
    this.searchProducts();
  }
  openModal = () => {
    $('#checkoutLoginModal').fadeIn(200);
  };
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

  openFilter = () => {
    $('.filter-section-wrap').css('left', '0');
  }
  /**
   * previous page
   */
  prePage(): void {
    if (this.param.pageNo != 1) {
      this.param.pageNo--;
      this.searchProducts();
    }
  }
  /**
   * next page
   */
  nextPage(): void {
    if (this.param.pageNo < this.totalPage) {
      this.param.pageNo++;
      this.searchProducts();
    }
  }
}


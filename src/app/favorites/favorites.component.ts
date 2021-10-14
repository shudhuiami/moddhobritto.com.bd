import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ApiServices} from '../services/api.services';
import {HelperServices} from '../services/helper.service';
import {NotificationService} from '../services/notification.service';
import {AuthServices} from '../services/auth.services';

declare let $: any;

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
})
export class FavoritesComponent implements OnInit {
  ENV = environment;
  wishLists = [];
  Auth = null;
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
  Loading= false;
  quantity = 1;
  SingleData: any = {};
  price: 0;
  preview: null;
  variants = {
    variant_id : 0
  };
  constructor(private router: Router, private http: HttpClient, protected authServices: AuthServices,protected apiService: ApiServices, private route: ActivatedRoute, protected helperService: HelperServices, protected notificationServices: NotificationService) {}
  ngOnInit(): void {
    this.getWishLists();
  }

  closeFilter = () => {
    $('.filter-section-wrap').css('left', '-100%');
  }
  openFilter = () => {
    $('.filter-section-wrap').css('left', '0');
  }

  getWishLists = () => {
    this.Loading = true;
    this.apiService.getWishList(this.param).subscribe(res => {
      if (res.status === 2000) {
        this.laravelData = res.data;
        this.Loading = false
        let AllProducts = [];
        $.each(res.data.data, (index, product) => {
          product['features'] = JSON.parse(product.features);
          if (product['features'].length > 6) {
            product['features'].length = 6;
          }
          AllProducts.push(product);
        });
        this.wishLists = AllProducts;
      }
    });
  }
  changePage(pagination): void {
    this.param.page = pagination.page;
    this.getWishLists();
  }


}

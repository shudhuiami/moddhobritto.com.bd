import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ApiServices} from '../../services/api.services';
import {HelperServices} from '../../services/helper.service';
import {AuthServices} from '../../services/auth.services';
import {NotificationService} from '../../services/notification.service';
import {prepareSyntheticPropertyName} from '@angular/compiler/src/render3/util';
import {Store} from '@ngrx/store';

declare let $: any;

@Component({
  selector: 'app-sub-shop-widget',
  templateUrl: './sub-shop-widget.component.html',
})
export class SubShopWidgetComponent implements OnInit {
  ENV = environment;

  shop_slug = '';
  Auth = null;
  Loading = false;
  shops = [];
  $store: any = null;
  constructor(private store: Store<{store}>, private router: Router, private http: HttpClient, protected apiService: ApiServices, private route: ActivatedRoute, protected apiServices: ApiServices, protected authServices: AuthServices, protected notificationServices: NotificationService) {
    this.shop_slug = this.route.snapshot.paramMap.get('slug');
    router.events.subscribe((event) => {
      this.shop_slug = this.route.snapshot.paramMap.get('slug');
    });
    this.apiServices.updateShopId(this.shop_slug);
    this.apiServices.currentShopId.subscribe(res => {
      this.shop_slug = res;
    });
  }
  getSubShops = () => {
    this.Loading = true;
    this.apiService.getSubShops(this.shop_slug).subscribe(response => {
      this.Loading = false;
      if (response.status === 2000) {
        this.shops = response.data.data;
      }
    });
  }
  ngOnInit(): void {
    this.$store = this.store.select("store").subscribe((data) => {
      this.Auth = data.auth;
    })
    this.getSubShops();
  }

}

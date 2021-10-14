import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ApiServices} from '../../services/api.services';
import {HelperServices} from '../../services/helper.service';
import {NotificationService} from '../../services/notification.service';
import {AuthServices} from '../../services/auth.services';
import {Store} from '@ngrx/store';


declare let $: any;

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
})
export class orderDetailComponent implements OnInit {
  ENV = environment;
  wishLists = [];
  cartData = [];
  Order = null;
  Order_status = null;
  order_number = '';
  Auth = null;
  token = null;
  loading = false;
  advancedPay = false;
  partialAmount = '';

  $store: any = null;
  constructor(private store: Store<{store}>, private router: Router, private http: HttpClient, protected apiService: ApiServices, protected authServices: AuthServices, private route: ActivatedRoute, protected helperServices: HelperServices, protected notificationServices: NotificationService) {
    this.order_number = this.route.snapshot.paramMap.get('order_number');
    this.$store = this.store.select("store").subscribe((data) => {
      this.Auth = data.auth;
      this.token = data.token;

    })
    this.getOrderDetail();
    this.getCart();

  }


  getOrderDetail(): void {
    this.loading = true;
    this.apiService.getOrderDetail({order_number: this.order_number}).subscribe(res => {
      this.loading = false;
        if (res.status === 2000) {
          this.Order = res.data;
          this.Order_status = parseInt(res.data.status)
          if (this.Order.payment_status == null) {
            this.router.navigate(['/order/'+this.Order.order_number+'/payment']);
          }
        }
      }
    );
  }

  ngOnInit(): void {
    if (this.Auth == null) {
      this.router.navigate(['/login']);
    }
  }
  ngOnDestroy(){
    this.$store.unsubscribe();
  }



  getCart = () => {
    this.helperServices.getCart();
  }




}

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
  selector: 'app-pay',
  templateUrl: './pay.component.html',
})
export class payComponent implements OnInit {
  ENV = environment;
  wishLists = [];
  cartData = [];
  Order = null;
  orderNumber = '';
  Auth = null;
  token = null;
  loading = false;
  PaymentLoading = false;
  PaymentLoading2 = false;
  advancedPay = false;
  partialAmount = '';

  $store: any = null;
  constructor(private store: Store<{store}>, private router: Router, private http: HttpClient, protected apiService: ApiServices, protected authServices: AuthServices, private route: ActivatedRoute, protected helperServices: HelperServices, protected notificationServices: NotificationService) {
    this.orderNumber = this.route.snapshot.paramMap.get('order_number');
    this.$store = this.store.select("store").subscribe((data) => {
      this.Auth = data.auth;
      this.token = data.token;
    })
    this.getOrderDetail();

  }

  closeAddAddressModal = () => {
    $('#addpay').fadeOut(200);
  }
  paymentModal(): void {
    $('#addpay').fadeIn(200);
  }

  getOrderDetail(): void {
    this.loading = true;
    this.apiService.getOrderDetail({order_number: this.orderNumber}).subscribe(res => {
      this.loading = false;
        if (res.status === 2000) {
          this.Order = res.data;
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

  IsEmptyCheck = (obj) => {
    if (Object.keys(obj).length > 0) {
      return true;
    }
    return false;
  };

  addToCartCheckOut = (event, product_id, quantity, index) => {

    let trigger = $(event.target);
    if (!trigger.hasClass('btn')) {
      trigger = trigger.parent();
    }
    let formData = {product_id: product_id, quantity: quantity};
    let guest_user_id = localStorage.getItem('guest_user_id');
    if (guest_user_id != null) {
      formData['guest_user_id'] = guest_user_id;
    }
    this.apiService.addToCart(formData).subscribe(res => {
      if (res.status === 2000) {
        if (guest_user_id == null) {
          localStorage.setItem('guest_user_id', res.guest_user_id);
        }
        this.getCart();
      }
    });
  }

  getCart = () => {
    this.helperServices.getCart();
  }

  confirmOrder(type): void {
    this.PaymentLoading = true;
    const order = this.Order.id;
    const paymentStatus = this.Order.payment_status;
    if (type === 'cash') {
      const formData = {order_id: order};
      this.apiService.createCashOnDelivery(formData).subscribe((res: any) => {
        this.PaymentLoading = false;
        if (res.status === 2000) {
          this.notificationServices.showInfo('Success', 'Order Successfully Placed.')
          this.router.navigate(['order', this.orderNumber, 'order-successful']);
        }
      });
    } else {
      window.location.href = this.ENV.PAY_URL + '/payment?token=' + this.token + '&orderId=' + order + '&payment_status=' + paymentStatus ;
    }
  }

  selectMethod = (data, type, paymentStatus) =>{
    this.Order.payment_method = data;
    this.Order.status = type;
    this.Order.payment_status = paymentStatus;
  }


}

import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ApiServices} from '../services/api.services';
import {HelperServices} from '../services/helper.service';
import {AuthServices} from '../services/auth.services';
import {NotificationService} from '../services/notification.service';

declare let $: any;

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
})
export class orderStatusComponent implements OnInit {
  ENV = environment;


  orderStatus = 0;
  orderDetails = [];
  loading = false;
  param: any = {
    limit: 15,
    page: 1,
  };
  totalPage: any = 0;
  totalData: any = 0;
  catName: any = '';
  Auth = null;
  laravelData: any = null;

  constructor(private router: Router, private http: HttpClient,  private route: ActivatedRoute, protected apiServices: ApiServices, protected authServices: AuthServices, protected notificationServices: NotificationService) {
  this.GetOrders(this.orderStatus)
  }
  ngOnInit(): void {
    $(function() {
      $(".orderDetails").click(function() {
        // remove classes from all
        $(".orderDetails").removeClass("active");
        // add class to the one we clicked
        $(this).addClass("active");
      });
    });

  }





  changePage(pagination): void {
    this.param.page = pagination.page;
    this.GetOrders(this.orderStatus);
  }
//  Confirmation Cancel order Modal
  openConfirmationModal = () =>{
    $('.confirmation').fadeIn(200 )
  }
//  Close Confirmation Cancel Order Modal
  closeConfirmationModal = () =>{
    $('.confirmation').fadeOut(200)
  }


//  Get Orders
  GetOrders = (status) =>{
    this.loading = true;
    console.log(this.loading)
    this.orderStatus = status;
    let orderParam = {
      status : status,
      limit: this.param.limit,
      page: this.param.page,
    }
    this.apiServices.getOrders(orderParam).subscribe(res => {
      setTimeout( () =>{
        this.loading = false;
        console.log(this.loading)
      },200)
      if(res.status === 2000){
        this.orderDetails = res.data.data;
        this.laravelData = res.data;
      }
    })
  }

//Cancel Order
  CancelOrder = (event,order_id, index) =>{
    let trigger =$(event.target)
    let orderData = {
      order_id :order_id
    };
    trigger.closest('.btn').html('<i class="las la-spinner la-spin"></i>')
    this.apiServices.cancelOrder(orderData).subscribe(res =>{
      if (res.status === 2000){
        this.notificationServices.showInfo('Removed', 'Order Removed')
        trigger.closest('.btn').html('<i class="las la-times"></i>')
        this.GetOrders(this.orderStatus)
      }
    })
  }


}

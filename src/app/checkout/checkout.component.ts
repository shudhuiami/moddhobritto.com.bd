import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ApiServices} from '../services/api.services';
import {HelperServices} from '../services/helper.service';
import {NotificationService} from '../services/notification.service';
import {AuthServices} from '../services/auth.services';
import {Store} from '@ngrx/store';
import {getGlobalShops, GlobalCartClear, GlobalCartModal} from '../state/store.actions';
import {parse} from "ts-node";

declare let $: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  ENV = environment;
  wishLists = [];
  cartInfo: any = {
    total_price: 0,
    total_products: 0,
  };
  slideLoading = true;
  quantity = 1;
  Auth = null;
  orderSuccess = '';
  email = null;
  addressError = '';
  methodsError = '';
  transectionError = '';
  allAddress = [];
  address = '';
  previewAddress: any = {};
  payment = [];
  orderParam: any = {
    address_id: '',
    payment_method: 'cash',
    shop_id: -1,
    transaction_id: '',
  };
  msg = '';
  param: any = {
    limit: 500,
  };
  errors = null
  shippingPrice: any = 0;
  AddAddress = {
    title: '',
    phone: '',
    street: '',
    city: '',
    zip: '',
    division: '',
    district: '',
    area: '',
  };
  division = [];
  district = [];
  area = [];
  showData:any ={};
  loading = false;
  ShopProduct: any ={};
  btnLoading = false;
  activeError = '';

  AddToCartForm: any = {
    product_id: '',
    variant_id: '',
    quantity: 1
  };
  cartData:any  = {};
  $store: any = null;
  constructor(private store: Store<{store}>, private router: Router, private http: HttpClient, protected apiService: ApiServices, protected authServices: AuthServices, private route: ActivatedRoute, protected helperServices: HelperServices, protected notificationServices: NotificationService) {
    this.$store = this.store.select("store").subscribe((data) => {
      this.cartData = data.GlobalCart;
      this.Auth = data.auth;
      if(data.GlobalCart.cartList.length > 0){
        this.showData = this.cartData.cartList
        if(this.showData.length > 0){
          this.getData(this.showData[0].shop_id);
        }
      }
    })
  }
  ngOnInit(): void {
    if (this.Auth == null) {
      this.router.navigate(['/login']);
    }

    this.getAllAddress();
    this.Methods();
    let userData = JSON.parse(localStorage.getItem("userData"))
    this.email = userData.email
  }
  ngOnDestroy(){
    this.$store.unsubscribe();
  }
  getAllAddress = () => {
    this.loading = true;
    this.apiService.getAddress(this.param).subscribe(res => {
      this.loading = false;
      if (res.status === 2000) {
        this.allAddress = res.data.data;
        if(this.allAddress.length > 0){
        this.orderParam.address_id = this.allAddress[0].id

        let index = this.allAddress.map(e => e.id).indexOf(parseInt(this.orderParam.address_id));
        this.previewAddress = this.allAddress[index];
        this.shippingPrice =  parseInt(this.previewAddress.delivery_price)
        }
      }
    });
  };

  openActiveModal = () =>{
    $('#activeAccount').fadeIn()
  }
  closeActiveModal = () =>{
    $('#activeError').fadeOut()
  }
  IsEmptyCheck = (obj) => {
    if (Object.keys(obj).length > 0) {
      return true;
    }
    return false;
  };
  paymentMethod(n): void {
    if (n === 1) {
      $('.btn-online').addClass('active');
      $('.btn-cash-on-delivery').removeClass('active');
      $('.cardCode').slideDown(100);
      this.orderParam.payment_method = '';
    }
    if (n === 2) {
      $('.btn-cash-on-delivery').addClass('active');
      $('.btn-online').removeClass('active');
      $('.cardCode').slideUp(100);
      this.orderParam.payment_method = 'cash';
    }

  }
  showMsg = () => {

    if (this.orderParam.payment_method == 'bkash') {
      this.msg = 'Go to bKash Menu by dialing *247#\n' +
        'Choose \'Payment\' option by pressing \'3\'\n' +
        'Enter our Merchant wallet number : 01730791523\n' +
        'Enter BDT. amount you have to pay : xxxx\n' +
        'Enter a reference against your payment : Bata Order number. Ex: 12401234\n' +
        'Enter the counter number : 1\n' +
        'Now enter your PIN to confirm: xxxx\n' +
        'Done! You will get a confirmation SMS\n' +
        'Enter your bKash wallet/ contact number and transaction ID in the below form and submit.';
    } else {
      this.msg = '';
    }
  };
  addToCartCheckOut = (event, product_id, quantity, index, variant_id) => {
    let trigger = $(event.target);
    if (!trigger.hasClass('btn')) {
      trigger = trigger.parent();
    }
    let formData = {product_id: product_id, quantity: quantity, variant_id:variant_id};
    let guest_user_id = localStorage.getItem('guest_user_id');
    if (guest_user_id != null) {
      formData['guest_user_id'] = guest_user_id;
    }
    this.apiService.addToCart(formData).subscribe(res => {
      if (res.status === 2000) {
        this.getCart();
        if (guest_user_id == null) {
          localStorage.setItem('guest_user_id', res.guest_user_id);
        }
      }
    });

  };
  getCart = () => {
    this.helperServices.getCart();
  };
  createOrders = (event) => {
    this.errors = null;
    let trigger = $(event.target);
    this.btnLoading = true;
    this.apiService.createOrder(this.orderParam).subscribe(res => {
      this.btnLoading = false;
      if (res.status === 2000) {
        this.orderSuccess = res.msg;
        this.router.navigate(['order',res.order_number, 'payment' ]);
      } else {

        this.errors = res.error
        console.log(this.errors)
        if (res.error.address_id != undefined) {
          this.addressError = res.error.address_id[0];
        }
        if (res.error.payment_method != undefined) {
          this.methodsError = res.error.payment_method[0];
        }
        if (res.error.transaction_id != undefined) {
          this.transectionError = res.error.transaction_id[0];
        }
        if (res.error.error != undefined) {
          this.activeError = res.error.error[0];
          if(this.activeError === 'Account is not activate. Please active your account.'){
            this.openActiveModal()
          }
        }
      }
    });
  };
  addToWishlist = (event, product_id, index, product_index) => {
    let formData = {product_id: product_id};
    this.apiService.addToWishlist(formData).subscribe(res => {
        if (res.status === 2000) {
          this.notificationServices.showInfo('Success', 'WishList Added Successful');
          this.cartData.cartList.products[product_index].wished = 1;
        }
      }
    );
  };
  deleteWishList = (event, product_id, index, product_index) => {
    let trigger = $(event.target);
    let formData = {product_id: product_id};
    this.apiService.deleteWishList(formData).subscribe(res => {
        if (res.status === 2000) {
          this.notificationServices.showInfo('Removed', 'Wishlist Removed');
          this.cartData[index].products[product_index].wished = null;
        }
      }
    );
  };
  deleteCartItem = (event, product_id, index) => {
    let trigger = $(event.target);
    if (!trigger.hasClass('btn')) {
      trigger = trigger.parent();
    }
    trigger.html('<i class="las la-spinner la-spin"></i>');
    let guest_user_id = localStorage.getItem('guest_user_id');
    let DeleteItem = {product_id: product_id};
    if (guest_user_id != null) {
      DeleteItem['guest_user_id'] = guest_user_id;
    }
    this.apiService.DeleteCartItem(DeleteItem).subscribe(res => {
        if (res.status === 2000) {
          this.notificationServices.showInfo('Removed', ' Removed From Cart');
          trigger.closest('.btn').html('<i class="las la-trash"></i>');
        }
      }
    );
  };
  Methods = () => {
    this.apiService.getPaymentMethod('').subscribe(res => {
      if (res.status === 2000) {
        this.payment = res.data;
      }
    });
  };
  ChooseAddress = (address, index) => {
    this.previewAddress = address
    this.shippingPrice = address.delivery_price
    $('#addressList').fadeOut()

  };
  closeAddAddressModal = () => {
    $('#addAddress').fadeOut(200);
  };
  closeAddressModal = () => {
    $('#addressList').fadeOut(200);
  };
  CreateAddressModal = () => {
    this.closeAddressModal()
    this.division = [];
    this.district = [];
    this.area = [];
    this.getAllDivisions();
    $('.create-form').removeClass('is-invalid');
    $('.invalid-feedback').html('');
    this.AddAddress = {
      title: '',
      phone: '',
      street: '',
      city: '',
      zip: '',
      division: '',
      district: '',
      area: ''
    };
    $('#addAddress').fadeIn(200);

  };
  createdAddress = () => {
    $('.create-form').removeClass('is-invalid');
    $('.invalid-feedback').html('');
    this.loading = true;
    this.apiService.createAddress(this.AddAddress).subscribe(res => {
      if (res.status === 2000) {
        this.notificationServices.showInfo('Success', 'Address Created');
        this.getAllAddress();
        this.closeAddAddressModal();
        this.loading = false;
      } else {
        this.ErrorHandaler2(res.error);
        this.loading = false;
      }
    });
  };
  ErrorHandaler2(error): void {
    $.each(error, function(i, v) {
      $('[name=' + i + ']').closest('.form-group').find('.create-form').addClass('is-invalid');
      $('[name=' + i + ']').closest('.form-group').find('.invalid-feedback').html(v);
    });
  }
  getAllDivisions = () => {
    this.apiService.getDivision('').subscribe(res => {
      if (res.status === 2000) {
        this.division = res.data;
      }
    });
  }
  getAllDistrict = () => {
    let division_id = {
      division_id: this.AddAddress.division,
    };
    this.apiService.getDistrict(division_id).subscribe(res => {
      if (res.status === 2000) {
        this.district = res.data;
      }
    });

  }
  getAllArea = () => {
    let district_id = {
      district_id: this.AddAddress.district,
    };
    this.apiService.getArea(district_id).subscribe(res => {
      if (res.status === 2000) {
        this.area = res.data;
      }
    });
  }
  getData = (shop_id) => {
    this.orderParam.shop_id = shop_id;
    this.ShopProduct  = this.showData.find(item => item.shop_id === shop_id);
  }
  openAddressMOdal = () => {
    $('#addressList').fadeIn()
  }

}

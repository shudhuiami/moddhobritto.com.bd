import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {HelperServices} from '../../services/helper.service';
import {environment} from '../../../environments/environment';
import {AuthServices} from '../../services/auth.services';
import {ApiServices} from '../../services/api.services';
import {NotificationService} from '../../services/notification.service';
import {Store} from '@ngrx/store';
import {
  CustomerActiveAccount,
  CustomerAuthStore,
  getGlobalShops,
  GlobalCartClear,
  GlobalCartModal
} from '../../state/store.actions';

declare let $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  ENV = environment;
  webData = null;
  Auth = null;
  cartData = {
    cartList: [],
    total_price: 0,
    total_products: 0,
  };
  shops = [];
  pages = [];
  UserInfo: any = {
    phone: ''
  };
  categories = [];
  details: any = null;
  loading = false;
  status = 0;
  shop_slug = null;
  signInForm = {
    email: '',
    password: '',
  };
  loadingbtn = false;
  search_keyword: any = '';
  bodyParam = {
    tree: true,
    hide_empty_category: 1

  };
  selectedCartProduct: any = {};
  CustomerAcAccount: any = {
    phone: ''
  };
  ActiveAccountCode: any = '';
  ActiveAccountCount: any = 0;
  ActiveAccountCountTotal: any = 180;
  ActiveAccountCountStatus: any = false;
  ActiveAccountCountInterval: any = null;
  Price: any = {};
  price_was: any = {};
  price_current: any = {};
  reduce_price: any = {};
  AddToCartForm: any = {
    product_id: '',
    requirements: '',
    variant_id: '',
    quantity: 1
  };
  CartModalLoading = false;
  $store: any = null;

  type_i: any = 0;
  type_placeholder: any = '';
  type_txt_arr: any = ['Search by product name', ' Search by shop name'];
  type_txt: any = '';
  type_txt_index: any = 0;
  type_speed: any = 250;
  Type_timeout: any = null;

  constructor(private store: Store<{ store }>, private router: Router, protected apiService: ApiServices, protected helperServices: HelperServices, protected authServices: AuthServices, private route: ActivatedRoute, protected apiServices: ApiServices, protected notificationServices: NotificationService) {
  }

  ngOnInit(): void {
    // $('#select-city').fadeIn()
    $('#offer-modal').fadeIn()
    this.$store = this.store.select("store").subscribe((data) => {
      this.shops = data.shops;
      this.Auth = data.auth;
      this.cartData = data.GlobalCart;
      if (Object.keys(data.SelectedCartProduct).length > 0) {
        this.selectedCartProduct = data.SelectedCartProduct;
        if (data.SelectedCartProduct.variants.length > 0) {
          this.AddToCartForm.product_id = data.SelectedCartProduct.id
          this.AddToCartForm.variant_id = data.SelectedCartProduct.variants[0].id
          this.Price = parseInt(data.SelectedCartProduct.variants[0].price)

          let Product = this.selectedCartProduct;
          if (Product.discount_type == 0) {
            let Price = this.Price / 100 * parseInt(Product.discount_amount)
            this.price_was = parseInt(this.Price + Price);
            this.price_current = this.Price;
            this.reduce_price = parseInt(Product.discount_amount)
          } else if (Product.discount_type == 1) {
            this.price_was = this.Price + parseInt(Product.discount_amount);
            this.price_current = this.Price;
            this.reduce_price = parseInt(Product.discount_amount)
          } else if (Product.discount_type == 2) {
            this.price_current = this.Price;
          }
        }
      }
    })
    this.getCart();
    this.getProfiles();
    this.getWebData();
    this.getPages();
    this.getShops();
    this.getCategories();

  }
  ngAfterViewInit(): void {
    this.closeModal();
    setTimeout(() => {
      this.InitTypingEffect()
    },800)
    $(document).mouseup(function (e) {
      const container = $('.outsideClick, .CartOutsideClick, .outsideClickCloseModal, .more-category');
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.removeClass('active');
      }
    });
    $(document).scroll(function () {
      let y = $(this).scrollTop();
      if (y > 500) {
        $('.bottom-to-top').fadeIn(500);
      } else {
        $('.bottom-to-top').fadeOut(500);
      }
    });
  }
  InitTypingEffect = () => {
    this.type_placeholder = '';
    this.type_i = 0;
    this.type_txt = this.type_txt_arr[this.type_txt_index];
    this.TypingEffect();
  }
  TypingEffect = () => {
    if(this.type_txt.length === this.type_i){
      clearTimeout(this.Type_timeout)
      if(this.type_txt_index == (this.type_txt_arr.length - 1)){
        this.type_txt_index = 0;
      }else{
        this.type_txt_index++;
      }
      setTimeout(() => {
        this.InitTypingEffect()
      },400)
      return;
    }
    this.type_placeholder += this.type_txt.charAt(this.type_i);
    this.type_i++
    this.Type_timeout = setTimeout(this.TypingEffect, this.type_speed)
  }
  encryptPhone = (str) => {
    return str.replace(str.substring(3, 8), "*****");
  }
  timerCountdown = (current_time) => {
    this.ActiveAccountCountTotal = this.ActiveAccountCountTotal - current_time;
    this.ActiveAccountCountStatus == true;
    this.ActiveAccountCountInterval = setInterval(() => {
      if (this.ActiveAccountCountTotal > 0) {
        this.ActiveAccountCountTotal = this.ActiveAccountCountTotal - 1;
      } else {
        clearInterval(this.ActiveAccountCountInterval)
        this.ActiveAccountCountStatus == false;
      }
    }, 1000)

  }
  ngOnDestroy() {
    this.$store.unsubscribe();
  }
  closeActiveModal = () => {
    $('#activeAccount').fadeOut()
    this.ActiveAccountCountTotal = 180;
    clearInterval(this.ActiveAccountCountInterval)
  }
  sentRequest = () => {
    let data = {
      ActivationCount: 0,
      userInfo: {
        phone: '',
      },
    }
    let last_send_activation = localStorage.getItem('_last_send_activation_')
    if (last_send_activation != null) {
      let last_send_activation_parse = JSON.parse(last_send_activation)
      let store_date_time = new Date(last_send_activation_parse.date_time);
      let now_date_time = new Date();
      let seconds = (now_date_time.getTime() - store_date_time.getTime()) / 1000;
      if (seconds > 180) {
        this.SendActivationCode();
        data['ActivationCount'] = 1;
      } else {
        data['ActivationCount'] = seconds;
      }
    } else {
      this.ActiveAccountCountTotal = 0;
      this.SendActivationCode();
      data['ActivationCount'] = 1;
    }
    // data['user'] = this.UserInfo;
    // this.store.dispatch(CustomerActiveAccount({data: data}));
    this.status = 1;
  }
  SendActivationCode = () => {
    if (this.ActiveAccountCountTotal == 0) {
      this.apiServices.SendActivationCode('').subscribe(res => {
        if (res.status === 2000) {
          let last_send_activation = {date_time: Date.now()}
          localStorage.setItem('_last_send_activation_', JSON.stringify(last_send_activation))
          let data = {
            ActivationCount: 1,
            user: this.CustomerAcAccount,
          }
          this.ActiveAccountCountTotal = 180;
          this.ActiveAccountCountStatus == true;
          this.timerCountdown(1)
        }
      });
    }
  }
  getProfiles = () => {
    this.loading = true;
    this.apiServices.getProfile('').subscribe(res => {
      if (res.status === 2000) {
        this.UserInfo = res.data;
        this.loading = false;
      }
    });
  }
  getCategories = () => {
    if (this.shop_slug != null) {
      this.apiService.getAllCategory(this.shop_slug, this.bodyParam).subscribe(res => {
        if (res.status === 2000) {
          this.categories = res.data;
          this.apiServices.updateCategories(res.data)
        }
      });
    }
  }
  getPages = () => {
    this.apiService.getAllPages().subscribe(response => {
      if (response.status === 2000) {
        this.pages = response.data;
        this.apiService.updatePage(response.data);
      }
    });
  }
  getDetail = () => {
    if (this.shop_slug != null) {
      this.apiService.getAllDetail(this.shop_slug).subscribe(res => {
        if (res.status === 2000) {
          this.details = res.data;
          this.apiService.updateShopId(res.data.slug);
        }
      });
    }
  }
  signIn = () => {
    $('.form-control').removeClass('is-invalid');
    $('.invalid-feedback').html('');
    this.loadingbtn = true;
    let guest_user_id = localStorage.getItem('guest_user_id');
    if (guest_user_id != null) {
      this.signInForm['guest_user_id'] = guest_user_id;
    }
    this.authServices.login(this.signInForm).subscribe(res => {
        this.loadingbtn = false;
        if (res.status === 2000) {
          let data = {token: res.data.token, user: res.data.userInfo}
          this.store.dispatch(CustomerAuthStore({data: data}))
          this.notificationServices.showInfo('Success', 'Login Successful')
          const userData = JSON.stringify(res.data.userInfo);
          localStorage.removeItem('guest_user_id')
          localStorage.setItem("userData", userData);
          localStorage.setItem("token", res.data.token);
          this.closeModal()
          setTimeout(() => {
            this.router.navigate(['/'],);
          }, 500)
        } else {
          this.ErrorHandaler(res.error);
        }
      }
    );
  }
  ErrorHandaler(error) {
    $.each(error, function (i, v) {
      $('[name=' + i + ']').closest('.form-group').find('.form-control').addClass('is-invalid');
      $('[name=' + i + ']').closest('.form-group').find('.invalid-feedback').html(v);
    });
  }
  emptyCart = () => {
    this.notificationServices.showInfo('', 'Your Cart is Empty');
  }
  search_products = () => {
    this.router.navigate(['/search', this.search_keyword]);
  }
  getWebData = () => {
    this.helperServices.webSettings().subscribe(response => {
      if (response.status === 2000) {
        this.webData = response.data;
        this.helperServices.updateWebsiteSettings(response.data);
      }
    });
  }
  getShops = () => {
    this.apiServices.getAllShops().subscribe(response => {
      if (response.status === 2000) {
        this.store.dispatch(getGlobalShops({data: response.data}))
      }
    });
  }
  openModal = () => {
    $('#checkoutLoginModal').fadeIn(200);
  }
  closeModal = () => {
    $('#checkoutLoginModal').fadeOut(200);
  }
  closeSelectDistrict = () => {
    $('#select-city').fadeOut(200);
  }
  closeOfferModal = () => {
    $('#offer-modal').fadeOut(200);
  }
  backToTop = () => {
    window.scroll({
      behavior: 'smooth',
      left: 0,
      top: 0
    });
  }
  logout = () => {
    localStorage.clear();
    this.notificationServices.showInfo('Success', 'LogOut Successful');
    setTimeout(() => {
      window.location.href = '';
    }, 300);
  }
  activeMenu(): void {
    $('.sidebar-menu-wrap').addClass('active');
  }
  activeMenuAllShop(): void {
    $('.sidebar-menu-wrap-shop').addClass('active');
    $('.sidebar-menu-wrap-menu').removeClass('active');
  }
  activeMenuAllMenu(): void {
    $('.sidebar-menu-wrap-menu').addClass('active');
  }
  closeMenu(): void {
    $('.sidebar-menu-wrap').removeClass('active');
  }
  closeMenuAllShop(): void {
    $('.sidebar-menu-wrap-shop').removeClass('active');
  }
  closeMenuAllMenu(): void {
    $('.sidebar-menu-wrap-menu').removeClass('active');
  }
  toggleNavMenu(n): void {
    if (n === 1) {
      $('#cc').removeClass('active');
      $('#cc2').removeClass('active');
      $('#category-menu').removeClass('active');
      $('#mm').addClass('active');
      $('#main-menu').addClass('active');
    }
    if (n === 2) {
      $('#mm').removeClass('active');
      $('#mm2').removeClass('active');
      $('#main-menu').removeClass('active');
      $('#cc').addClass('active');
      $('#category-menu').addClass('active');
    }
  }
  showChildren(e): void {
    const target = $(e.target);
    target.closest('.parent').find('ul').toggle();
  }
  searchToggle(n): void {

    if (n === 1) {
      $('.header-search-sm-form').addClass('active');
    }
    if (n === 2) {
      $('.header-search-sm-form').removeClass('active');
    }
  }
  toggleCart(n): void {
    if (n === 1) {
      $('.sidebar-cart-wrap').addClass('active');
    } else {
      $('.sidebar-cart-wrap').removeClass('active');
    }
  }
  toggleProfile(): void {
    $('.outsideClick').toggleClass('active');
    $('.profile-link').toggleClass('active');
  }
  closeCartModal = () => {
    this.AddToCartForm.quantity = 1
    $('.CartModal').removeClass('active');
    $('#global-cart-image-slider').owlCarousel('destroy');
  }
  addToCart = (event) => {
    this.CartModalLoading = true;
    let Form = {
      product_id: this.AddToCartForm.product_id,
      requirements: this.AddToCartForm.requirements,
      quantity: this.AddToCartForm.quantity,
      variant_id: this.AddToCartForm.variant_id
    };
    let guest_user_id = localStorage.getItem('guest_user_id');
    if (guest_user_id != null) {
      Form['guest_user_id'] = guest_user_id;
    }
    this.apiServices.addToCart(Form).subscribe(res => {
        this.CartModalLoading = false;
        if (res.status === 2000) {
          if (guest_user_id == null){
            localStorage.setItem('guest_user_id', res.guest_user_id);
          }
          this.closeCartModal();
          this.notificationServices.showInfo('Success', res.success);
          this.getCart()
          this.AddToCartForm.quantity = 1
        }
      }
    )
  }
  ActiveAccountSubmit = () => {
    this.loadingbtn = true;
    let Form = {
      code: this.ActiveAccountCode,
    };
    this.apiServices.ActiveAccountSubmit(Form).subscribe(res => {
        this.loadingbtn = false
        if (res.status == 2000) {
          this.notificationServices.showInfo('Success', 'Your account has been activated');
          this.closeActiveModal();
          window.location.reload();
        } else {
          this.ErrorHandaler(res.error)
        }
      }
    )
  }
  getCart = () => {
    this.helperServices.getCart();
  };
  deleteCartItem = (event, product_id, variant_id) => {
    let trigger = $(event.target);
    if (!trigger.hasClass('btn')) {
      trigger = trigger.parent();
    }
    trigger.html('<i class="las la-spinner la-spin"></i>');
    let guest_user_id = localStorage.getItem('guest_user_id');
    let DeleteItem = {product_id: product_id, variant_id: variant_id};
    if (guest_user_id != null) {
      DeleteItem['guest_user_id'] = guest_user_id;
    }
    this.apiServices.DeleteCartItem(DeleteItem).subscribe(res => {
        trigger.closest('.btn').html('<i class="las la-trash"></i>');
        if (res.status === 2000) {
          this.notificationServices.showInfo('Removed', ' Removed From Cart');
          this.getCart();
        }
      }
    );
  }
  addToCartCountUpdate = (event, product_id, variant_id, quantity) => {
    let Form = {product_id: product_id, quantity: quantity, variant_id: variant_id};
    let guest_user_id = localStorage.getItem('guest_user_id');
    if (guest_user_id != null) {
      Form['guest_user_id'] = guest_user_id;
    }
    this.apiServices.addToCart(Form).subscribe(res => {
        if (res.status === 2000) {
          if (parseInt(res.guest_user_id) !== 0) {
            localStorage.setItem('guest_user_id', res.guest_user_id);
          }
          this.getCart();
        }
      }
    );
  };
  increase = () => {
    this.AddToCartForm.quantity = this.AddToCartForm.quantity + 1;
    if (this.AddToCartForm.quantity > 1) {
      $('.btn-minus').removeAttr('disabled');
    }
  }
  decrease = () => {
    this.AddToCartForm.quantity = this.AddToCartForm.quantity - 1;
    if (this.AddToCartForm.quantity == 1) {
      $('.btn-minus').attr('disabled', true);
    }
  }
  selectVariant(id) {
    this.AddToCartForm.variant_id = id;
    this.ProductPrice()
  }
  toggleDrop(e, type) {
    let trigger = $(e.target);
    console.log(trigger)
    if(type == 1){
      let target = trigger.closest('.drop-parent').find('.drop-body-top');
      target.toggle('_active')
      // target.addClass('_active')
    }else{
      let target = trigger.closest('.drop-parent').find('.drop-body-inner');
      target.toggle('_active')
    }
  }
  ProductPrice = () => {
    let Product = this.selectedCartProduct;

    if (Object.keys(Product).length > -1) {
      let index = Product.variants.map(function (e) {
        return e.id;
      }).indexOf(this.AddToCartForm.variant_id);
      let variant = Product.variants[index];
      let VariantPrice =  parseInt(variant.price);
      if (Product.discount_type == 0) {
          let Price = VariantPrice / 100 * parseInt(Product.discount_amount)
          this.price_was = VariantPrice + Price;
          this.price_current = VariantPrice;
          this.reduce_price = parseInt(Product.discount_amount)
      } else if (Product.discount_type == 1) {
          this.price_was = VariantPrice + parseInt(Product.discount_amount);
          this.price_current = VariantPrice;
          this.reduce_price = parseInt(Product.discount_amount)
      } else if (Product.discount_type == 2) {
          this.price_current = VariantPrice;
      }
    }
    return '0';
  }
  CheckObject = (obj) => {
    return Object.keys(obj).length > 0;
  }
}


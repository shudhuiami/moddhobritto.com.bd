import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ApiServices} from '../../services/api.services';

declare let $: any;

@Component({
  selector: 'app-top-products',
  templateUrl: './topProducts.component.html',
})
export class topProductsComponent implements OnInit {
  ENV = environment;
  @Input() shop_slug: string;
  topRatedProduct: any = [];
  Price: any = {};
  price_was: any = {};
  price_current: any = {};
  reduce_price: any = {};
  topProductLoading = false;
  constructor(protected apiService: ApiServices) {

  }
  ngOnInit(): void {
    this.getTopRated()

  }
  FormatText = (text, length) => {
    let newStr = '';

    if (text.length > length) {
      newStr = text.substr(0, length);
      newStr = newStr + '...';
    } else {
      newStr = text;
    }
    return newStr;
  };

  getTopRated = () => {
    this.topProductLoading = true;
    this.apiService.topRated(this.shop_slug).subscribe(res => {
      this.topProductLoading = false;
      if (res.status === 2000) {
        let chunk = 4;
        this.topRatedProduct = res.data.map((e, i) => {return i % chunk === 0 ? res.data.slice(i, i + chunk) : null;}).filter(e => {return e;});
        setTimeout(function() {
          $('.top-rated-slider').owlCarousel({
            loop: false,
            margin: 10,
            navText: ["<i class='las la-arrow-left'></i>", "<i class='las la-arrow-right'></i>"],
            nav: true,
            items: 1
          });
        }, 500);

      }
    });
  };
  showPrice = (data) => {
    console.log(data, 213)
    let Product = data;
    this.Price = Product.variants[0].price;
    if (Product.discount_type === 0){
      let Price = this.Price / 100 * Product.discount_amount
      this.price_was = parseInt(this.Price + Price)
      this.price_current = this.Price;
      this.reduce_price = Product.discount_amount;
    } else if (Product.discount_type === 1){
      this.price_was = parseInt(this.Price + Product.discount_amount);
      this.price_current = this.Price;
      this.reduce_price = Product.discount_amount
    } else if (Product.discount_type === 2){
      this.price_current = this.Price;
    }
  }
}


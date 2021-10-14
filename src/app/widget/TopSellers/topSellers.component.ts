import {Component, OnInit, Input} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ApiServices} from '../../services/api.services';

declare let $: any;

@Component({
  selector: 'app-top-sellers',
  templateUrl: './topSellers.component.html',
})
export class topSellersComponent implements OnInit {
  ENV = environment;
  topProduct: any = []
  loadingTop = false;

  @Input() shop_slug: string;

  constructor(protected apiService: ApiServices) {

  }
  ngOnInit(): void {
    this.gettopSell()
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

  gettopSell = () => {
    this.loadingTop = true;
    this.apiService.topSell(this.shop_slug).subscribe(res => {
      this.loadingTop = false;
      if (res.status === 2000) {
        let chunk = 4;
        this.topProduct = res.data.map((e, i) => {return i % chunk === 0 ? res.data.slice(i, i + chunk) : null;}).filter(e => {return e;});

        setTimeout(function() {
          $('.top-sellers-slider').owlCarousel({
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
}


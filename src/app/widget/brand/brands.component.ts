import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ApiServices} from '../../services/api.services';

declare let $: any;

@Component({
  selector: 'app-brand-widget',
  templateUrl: './brands.component.html',
})
export class BrandWidgetComponent implements OnInit {
  ENV = environment;
  @Input() shop_slug: string;
  brands: any = [];

  loading = false;
  constructor(protected apiService: ApiServices) {

  }
  ngOnInit(): void {
    this.getBrand()
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
  getBrand = () => {
    this.loading = true;
    this.apiService.getBrand(this.shop_slug).subscribe(res => {
      this.loading = false;
      if (res.status === 2000) {
        this.brands = res.data.data;
      }
    });
  }
}


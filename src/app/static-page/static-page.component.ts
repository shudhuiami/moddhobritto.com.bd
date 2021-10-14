import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ApiServices} from '../services/api.services';

declare let $: any;

@Component({
  selector: 'app-static-page',
  templateUrl: './static-page.component.html',
})
export class StaticPageComponent implements OnInit {

  shop_slug = '';
  page_slug = '';
  details = null;

  constructor(private router: Router, private http: HttpClient, protected apiService: ApiServices, private route: ActivatedRoute) {
    this.apiService.currentShopId.subscribe(res => {
      this.shop_slug = res;
    });
    this.page_slug = this.route.snapshot.paramMap.get('page_slug');
    this.getPageDetail();
  }

  getPageDetail = () => {
    this.apiService.getSinglePage(this.shop_slug, this.page_slug).subscribe(res => {
      if (res.status === 2000) {
        this.details = res.data;
        console.log(res.data);
      }
    });
  }

  ngOnInit(): void {
    $('.category-nav').removeClass('show');
  }

}
